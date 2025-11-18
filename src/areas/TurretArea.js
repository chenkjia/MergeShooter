const { styles } = require('../core/styles.js');
const { ctx, systemInfo, resourceManager } = require('../core/context.js');
const { on, emit } = require('../core/events.js');
const TurretSlot = require('../entities/turretSlot.js');
const { computeDropResult } = require('../core/mergeLogic.js');

class TurretArea {
  constructor(bounds) {
    this.bounds = bounds;
    this.container = null;
    this.bg = null;
    this.slots = [];
    this.tanks = [];
    this.draggingTank = null;
    this.dragSprite = null;
    this.dragStartSlot = null;
    this.dragOverSlot = null;
  }

  initialize() {
    this.createGrid();
    on('spawn_tank', this.spawnTank.bind(this));
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
        
      }
    }
  }

  draw() {
    ctx.fillStyle = `#${styles.colors.turretBg.toString(16)}`;
    ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    ctx.strokeStyle = '#00000033';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    for (let i = 0; i < this.slots.length; i++) this.slots[i].drawCanvas();
    if (this.draggingTank) {
      const tankImg = resourceManager.textures[`tank_level_${this.draggingTank.level}`];
      if (tankImg) {
        const tankSize = styles.turret.innerSize * 0.8;
        ctx.drawImage(tankImg, this.draggingTank.x - tankSize / 2, this.draggingTank.y - tankSize / 2, tankSize, tankSize);
      }
    }
    for (let i = 0; i < this.tanks.length; i++) this.tanks[i].draw();
  }

  update() {
    const isFull = this.slots.every(s => s.isOccupied());
    if (isFull !== this.wasFull) {
      emit('turret_slots_full', isFull);
      this.wasFull = isFull;
    }
  }

  onTouchMove(touches) {
    const t = touches && touches[0];
    if (!t) return;
    const x = t.clientX;
    const y = t.clientY;
    this.dragOverSlot = null;
    for (let i = 0; i < this.slots.length; i++) {
      const s = this.slots[i];
      if (s.contains(x, y)) {
        s.setState('hover');
        this.dragOverSlot = s;
      } else {
        s.setState('default');
      }
    }
    if (this.draggingTank) {
      this.draggingTank.x = x;
      this.draggingTank.y = y;
    }
  }

  onTouchStart(touches) {
    const t = touches && touches[0];
    if (!t) return;
    const x = t.clientX;
    const y = t.clientY;
    for (let i = 0; i < this.slots.length; i++) {
      const s = this.slots[i];
      if (s.contains(x, y) && s.isOccupied()) {
        this.draggingTank = s.tank;
        this.dragStartSlot = s;
        s.tank = null;
        break;
      }
    }
  }
  onTouchEnd() {
    const res = computeDropResult(this.draggingTank, this.dragStartSlot, this.dragOverSlot);
    if (res.type === 'merge') {
      this.dragOverSlot.occupy(res.level);
    } else if (res.type === 'move_to') {
      this.dragOverSlot.occupy(res.level);
    } else if (res.type === 'move_back') {
      this.dragStartSlot.occupy(this.draggingTank.level);
    }
    this.draggingTank = null;
    this.dragStartSlot = null;
    this.dragOverSlot = null;
    
  }

  spawnTank() {
    const emptySlot = this.slots.find(s => !s.isOccupied());
    if (emptySlot) {
      emptySlot.occupy(1);
    }
  }
}

module.exports = TurretArea;