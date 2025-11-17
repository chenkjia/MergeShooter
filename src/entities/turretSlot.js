import { turretSlotStyles, styles } from '../core/styles.js';
import { pixiApp, ctx, resourceManager } from '../core/context.js';

export class TurretSlot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.state = 'default';
    this.outerSize = styles.turret.outerSize;
    this.innerSize = styles.turret.innerSize;
    this.innerRadius = styles.turret.innerRadius;
    this.display = null;
    this.tank = null;
    this.createDisplay();
  }

  createDisplay() {
    if (pixiApp && typeof PIXI !== 'undefined') {
      const g = new PIXI.Graphics();
      this.display = g;
    }
  }

  setState(s) {
    this.state = s;
  }

  contains(px, py) {
    const half = this.outerSize / 2;
    return px >= this.x - half && px <= this.x + half && py >= this.y - half && py <= this.y + half;
  }

  isOccupied() {
    return !!this.tank;
  }

  occupy(level) {
    this.tank = { level };
  }

  drawCanvas() {
    const st = turretSlotStyles[this.state] || turretSlotStyles.default;
    const halfOuter = this.outerSize / 2;
    const halfInner = this.innerSize / 2;
    ctx.fillStyle = `#${styles.colors.turretOuter.toString(16)}`;
    ctx.fillRect(Math.floor(this.x - halfOuter), Math.floor(this.y - halfOuter), this.outerSize, this.outerSize);
    ctx.fillStyle = `#${styles.colors.turretInner.toString(16)}`;
    const ix = Math.floor(this.x - halfInner);
    const iy = Math.floor(this.y - halfInner);
    const r = this.innerRadius;
    ctx.beginPath();
    ctx.moveTo(ix + r, iy);
    ctx.arcTo(ix + this.innerSize, iy, ix + this.innerSize, iy + this.innerSize, r);
    ctx.arcTo(ix + this.innerSize, iy + this.innerSize, ix, iy + this.innerSize, r);
    ctx.arcTo(ix, iy + this.innerSize, ix, iy, r);
    ctx.arcTo(ix, iy, ix + this.innerSize, iy, r);
    ctx.closePath();
    ctx.fill();
    if (this.tank) {
      const tankImg = resourceManager.textures[`tank_level_${this.tank.level}`];
      if (tankImg) {
        const tankSize = this.innerSize * 0.8;
        const x = this.x - tankSize / 2;
        const y = this.y - tankSize / 2;
        ctx.drawImage(tankImg, x, y, tankSize, tankSize);
      }
    }
    if (st.borderWidth > 0) {
      ctx.lineWidth = st.borderWidth;
      ctx.strokeStyle = `#${st.borderColor.toString(16)}`;
      ctx.strokeRect(Math.floor(this.x - halfOuter), Math.floor(this.y - halfOuter), this.outerSize, this.outerSize);
    }
  }

  drawPixi() {
    if (!this.display) return;
    const st = turretSlotStyles[this.state] || turretSlotStyles.default;
    const g = this.display;
    g.clear();
    const halfOuter = this.outerSize / 2;
    const halfInner = this.innerSize / 2;
    g.beginFill(styles.colors.turretOuter);
    g.drawRect(Math.floor(this.x - halfOuter), Math.floor(this.y - halfOuter), this.outerSize, this.outerSize);
    g.endFill();
    g.beginFill(styles.colors.turretInner);
    g.drawRoundedRect(Math.floor(this.x - halfInner), Math.floor(this.y - halfInner), this.innerSize, this.innerSize, this.innerRadius);
    g.endFill();
    if (this.tank) {
      const tankTexture = resourceManager.textures[`tank_level_${this.tank.level}`];
      if (tankTexture) {
        const tankSprite = new PIXI.Sprite(tankTexture);
        const tankSize = this.innerSize * 0.8;
        tankSprite.width = tankSize;
        tankSprite.height = tankSize;
        tankSprite.anchor.set(0.5);
        tankSprite.x = this.x;
        tankSprite.y = this.y;
        g.addChild(tankSprite);
      }
    }
    if (st.borderWidth > 0) {
      g.lineStyle(st.borderWidth, st.borderColor, 1);
      g.drawRect(Math.floor(this.x - halfOuter), Math.floor(this.y - halfOuter), this.outerSize, this.outerSize);
    }
  }
}
