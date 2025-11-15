import { ctx } from '../core/context.js';

export class Tank {
  constructor(level, x, y, image) {
    this.level = level;
    this.x = x;
    this.y = y;
    this.width = 50; // 坦克宽度，可根据素材调整
    this.height = 50; // 坦克高度，可根据素材调整
    this.image = image;
    this.attack = 10 * level;
    this.attackSpeed = 1; // seconds per attack
    this.health = 100 * level;
    this.range = 150;
    this.lastAttackMs = 0;
  }

  draw() {
    if (this.image) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      // Fallback drawing if image is not loaded
      ctx.fillStyle = 'blue';
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = 'white';
      ctx.fillText(this.level, this.x + 20, this.y + 30);
    }
  }

  update(monsters) {
    const now = Date.now();
    const cd = this.attackSpeed * 1000;
    if (now - this.lastAttackMs < cd) return;
    if (!Array.isArray(monsters) || monsters.length === 0) return;
    let target = null;
    let bestDist = Infinity;
    for (let i = 0; i < monsters.length; i++) {
      const m = monsters[i];
      if (m.dead) continue;
      const dx = m.x + m.width / 2 - (this.x + this.width / 2);
      const dy = m.y + m.height / 2 - (this.y + this.height / 2);
      const d = Math.hypot(dx, dy);
      if (d <= this.range && d < bestDist) {
        bestDist = d;
        target = m;
      }
    }
    if (target) {
      target.health -= this.attack;
      this.lastAttackMs = now;
      if (target.health <= 0) {
        target.dead = true;
      }
    }
  }

  // 检查是否被点击或拖拽
  isTouched(touch) {
    return (
      touch.x >= this.x &&
      touch.x <= this.x + this.width &&
      touch.y >= this.y &&
      touch.y <= this.y + this.height
    );
  }
}