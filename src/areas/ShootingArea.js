import { pixiApp, ctx } from '../core/context.js';

export class ShootingArea {
  constructor(bounds) {
    this.bounds = bounds;
    this.container = null;
    this.bg = null;
  }
  initialize() {
    if (pixiApp && typeof PIXI !== 'undefined') {
      this.container = new PIXI.Container();
      this.bg = new PIXI.Graphics();
      this.container.addChild(this.bg);
      this.container.zIndex = 20;
      pixiApp.stage.addChild(this.container);
    }
  }
  draw() {
    if (pixiApp && typeof PIXI !== 'undefined') {
      this.bg.clear();
      this.bg.beginFill(0x2c5aa0, 0.6);
      this.bg.drawRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
      this.bg.endFill();
    } else {
      ctx.fillStyle = '#2c5aa099';
      ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    }
  }
  update() {}
  onTouchMove() {}
  onTouchStart() {}
  onTouchEnd() {}
}