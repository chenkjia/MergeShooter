const { turretSlotStyles, styles } = require('../core/styles.js');
const { ctx, resourceManager } = require('../core/context.js');

class TurretSlot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.state = 'default';
    this.outerSize = styles.turret.outerSize;
    this.innerSize = styles.turret.innerSize;
    this.innerRadius = styles.turret.innerRadius;
    this.display = null;
    this.shape = null;
    this.tankSprite = null;
    this.tank = null;
    
  }

  createDisplay() {}

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

  drawPixi() {}
}

module.exports = TurretSlot;