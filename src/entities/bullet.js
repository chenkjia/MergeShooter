const { resourceManager } = require('../core/context.js');

function resolveBulletTexture(type) {
  const key = `bullet_${type}`;
  const tex = resourceManager && resourceManager.textures ? resourceManager.textures[key] : null;
  return tex || null;
}

class Bullet {
  constructor(x, y, tx, ty, opts = {}) {
    this.x = x;
    this.y = y;
    this.radius = opts.radius || 6;
    this.speed = opts.speed || 300;
    this.damage = opts.damage || 10;
    this.type = opts.type || 1;
    this.texture = resolveBulletTexture(this.type);
    const dx = (tx || x) - x;
    const dy = (ty || y) - y;
    const d = Math.hypot(dx, dy) || 1;
    const vx = dx / d * this.speed;
    const vy = dy / d * this.speed;
    this.vx = vx;
    this.vy = vy;
    this.rotation = Math.atan2(this.vy, this.vx);
    this.active = true;
  }

  update(dt) {
    if (!this.active) return;
    const t = dt > 0 ? dt : 0.016;
    this.x += this.vx * t;
    this.y += this.vy * t;
  }

  draw(ctx) {
    if (!this.active || !ctx) return;
    if (!this.texture) this.texture = resolveBulletTexture(this.type);
    if (!this.texture || !this.texture.width || !this.texture.height) return;
    const w = this.texture.width;
    const h = this.texture.height;
    const scale = (this.radius * 2) / Math.max(w, h);
    const dw = w * 0.5;
    const dh = h * 0.5;
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation + Math.PI / 2);
    ctx.drawImage(this.texture, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  }
}

module.exports = Bullet;