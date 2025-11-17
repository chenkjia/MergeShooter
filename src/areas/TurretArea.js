import { styles } from '../core/styles.js';
import { pixiApp, ctx, systemInfo } from '../core/context.js';
import { TurretSlot } from '../entities/turretSlot.js';

export class TurretArea {
  constructor(bounds) {
    this.bounds = bounds;
    this.container = null;
    this.bg = null;
    this.slots = [];
  }

  initialize() {
    if (pixiApp && typeof PIXI !== 'undefined') {
      this.container = new PIXI.Container();
      this.bg = new PIXI.Graphics();
      this.container.addChild(this.bg);
      this.container.zIndex = 30;
      pixiApp.stage.addChild(this.container);
    }
    this.createGrid();
  }

  createGrid() {
    const rows = styles.turret.rows;
    const cols = styles.turret.cols;
    const spacing = styles.turret.spacing;
    const cellW = styles.turret.outerSize;
    const totalW = cols * cellW + (cols - 1) * spacing;
    const totalH = rows * cellW + (rows - 1) * spacing;
    const startX = this.bounds.x + Math.floor((this.bounds.width - totalW) / 2) + cellW / 2;
    const startY = this.bounds.y + Math.floor((this.bounds.height - totalH) / 2) + cellW / 2;
    this.slots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (cellW + spacing);
        const y = startY + r * (cellW + spacing);
        const slot = new TurretSlot(x, y);
        this.slots.push(slot);
        if (pixiApp && typeof PIXI !== 'undefined') {
          this.container.addChild(slot.display);
        }
      }
    }
  }

  draw() {
    if (pixiApp && typeof PIXI !== 'undefined') {
      this.bg.clear();
      this.bg.beginFill(styles.colors.turretBg);
      this.bg.drawRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
      this.bg.endFill();
      this.bg.lineStyle(1, 0x000000, 0.2);
      this.bg.drawRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
      for (let i = 0; i < this.slots.length; i++) this.slots[i].drawPixi();
    } else {
      ctx.fillStyle = `#${styles.colors.turretBg.toString(16)}`;
      ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
      ctx.strokeStyle = '#00000033';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
      for (let i = 0; i < this.slots.length; i++) this.slots[i].drawCanvas();
    }
  }

  update() {}

  onTouchMove(touches) {
    const t = touches && touches[0];
    if (!t) return;
    const x = t.clientX;
    const y = t.clientY;
    for (let i = 0; i < this.slots.length; i++) {
      const s = this.slots[i];
      if (s.contains(x, y)) s.setState('hover'); else s.setState('default');
    }
  }

  onTouchStart(touches) {}
  onTouchEnd(touches) {}
}