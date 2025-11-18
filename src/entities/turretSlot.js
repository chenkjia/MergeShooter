const { turretSlotStyles, styles } = require('../core/styles.js');
const { ctx } = require('../core/context.js');
const { drawTankWithBadge } = require('../core/draw.js');

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
    // 在当前槽位放置指定等级的炮塔（仅记录数据，实际绘制在 drawCanvas 中）
    this.tank = { level };
  }

  drawCanvas() {
    // 绘制外框与圆角内框
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
      drawTankWithBadge(this.x, this.y, this.tank.level, this.innerSize);
    }
    // 状态边框（默认/悬停/占用）
    if (st.borderWidth > 0) {
      ctx.lineWidth = st.borderWidth;
      ctx.strokeStyle = `#${st.borderColor.toString(16)}`;
      ctx.strokeRect(Math.floor(this.x - halfOuter), Math.floor(this.y - halfOuter), this.outerSize, this.outerSize);
    }
  }

  drawPixi() {}
}

module.exports = TurretSlot;