import { ctx } from '../core/context.js';

export class ShootingArea {
  constructor(bounds) {
    this.bounds = bounds;
    this.container = null;
    this.bg = null;
  }
  initialize() {}
  draw() {
    ctx.fillStyle = '#2c5aa099';
    ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
  }
  update() {}
  onTouchMove() {}
  onTouchStart() {}
  onTouchEnd() {}
}