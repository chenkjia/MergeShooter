const { styles } = require('../core/styles.js');
const { ctx } = require('../core/context.js');

class ShootingArea {
  constructor(bounds) {
    // 射击区域边界（用于绘制与触摸命中）
    this.bounds = bounds;
    this.container = null;
    this.bg = null;
    // 预计算的射击点中心集合（与炮塔列对齐）
    this.spots = [];
  }

  initialize() {
    // 计算并缓存射击点位置，保证与炮塔网格水平居中且列数一致
    const cols = styles.turret.cols;
    const spacing = styles.turret.spacing;
    const cellW = styles.turret.outerSize;
    const totalW = cols * cellW + (cols - 1) * spacing;
    const startX = this.bounds.x + Math.floor((this.bounds.width - totalW) / 2) + Math.floor(cellW / 2);
    const centerY = this.bounds.y + Math.floor(this.bounds.height - styles.shooting.spotHeight / 2 - spacing);
    this.spots = [];
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (cellW + spacing);
      this.spots.push({ x, y: centerY });
    }
  }

  // 绘制圆角矩形填充（canvas 2d 无现成API，使用 arcTo 近似）
  drawRoundRect(x, y, w, h, r, fillStyle) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(ix + rr, iy);
    ctx.arcTo(ix + w, iy, ix + w, iy + h, rr);
    ctx.arcTo(ix + w, iy + h, ix, iy + h, rr);
    ctx.arcTo(ix, iy + h, ix, iy, rr);
    ctx.arcTo(ix, iy, ix + w, iy, rr);
    ctx.closePath();
    ctx.fill();
  }

  draw() {
    if (!ctx) return;
    // 清空虚线设置，统一线段样式
    if (typeof ctx.setLineDash === 'function') ctx.setLineDash([]);
    // 绘制射击区域背景与细边框
    ctx.fillStyle = `#${styles.colors.turretBg.toString(16)}`;
    ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    ctx.strokeStyle = '#00000022';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

    // 若尚未初始化，则先计算射击点
    if (this.spots.length === 0) this.initialize();

    // 绘制每个射击点的圆角底座与十字瞄准线
    const sw = styles.shooting.spotWidth;
    const sh = styles.shooting.spotHeight;
    const r = styles.shooting.spotRadius;
    const inset = Math.max(4, Math.floor(Math.min(sw, sh) * 0.1));
    const crossSize = Math.floor(Math.min(sw - inset * 2, sh - inset * 2) * 0.6);
    const barTh = 10; // 十字的横竖厚度固定为 10px
    for (let i = 0; i < this.spots.length; i++) {
      const { x, y } = this.spots[i];
      const ix = Math.floor(x - sw / 2);
      const iy = Math.floor(y - sh / 2);
      // 外层圆角底座
      this.drawRoundRect(ix, iy, sw, sh, r, `#bef2ee`);
      // 内层圆角凹陷（制造层次感）
      this.drawRoundRect(ix + inset, iy + inset, sw - inset * 2, sh - inset * 2, Math.max(2, r - 2), `#a2dfdc`);
      // 十字瞄准线（使用矩形而非线段）
      const cx = Math.floor(ix + sw / 2);
      const cy = Math.floor(iy + sh / 2);
      const half = Math.floor(crossSize / 2);
      ctx.fillStyle = '#70cacd';
      // 横向矩形
      ctx.fillRect(cx - half, cy - Math.floor(barTh / 2), crossSize, barTh);
      // 纵向矩形
      ctx.fillRect(cx - Math.floor(barTh / 2), cy - half, barTh, crossSize);
    }
  }

  update() {
    // 射击区域当前无状态更新逻辑（预留）
  }

  onTouchMove() {
    // 触摸移动事件（预留）：可用于拖拽瞄准或特殊交互
  }

  onTouchStart() {
    // 触摸开始事件（预留）
  }

  onTouchEnd() {
    // 触摸结束事件（预留）
  }
}

module.exports = ShootingArea;