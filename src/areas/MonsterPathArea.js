import { ctx } from '../core/context.js';

export class MonsterPathArea {
  constructor(bounds) {
    this.bounds = bounds;
    this.container = null;
    this.bg = null;
  }
  initialize() {}
  draw() {
    ctx.fillStyle = '#23323f99';
    ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
  }
  update() {}
  onTouchMove() {}
  onTouchStart() {}
  onTouchEnd() {}
}