import { ctx } from '../core/context.js';

export class Monster {
  constructor(x, y, image, opts = {}) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.image = image;
    this.speed = 1;
    this.direction = 1; // 1 for right, -1 for left
    this.type = opts.type || 'normal';
    const baseHp = opts.baseHp || 100;
    const baseAtk = opts.baseAtk || 5;
    let hpMul = 1;
    let atkMul = 1;
    if (this.type === 'elite') { hpMul = 2; atkMul = 2; }
    if (this.type === 'boss') { hpMul = 10; atkMul = 5; }
    this.health = baseHp * hpMul;
    this.attack = baseAtk * atkMul;
    this.dead = false;
  }

  draw() {
    if (this.image) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  update(gameArea) {
    this.x += this.speed * this.direction;

    // Reverse direction and move down when hitting the horizontal boundaries
    if (this.x + this.width > gameArea.x + gameArea.width || this.x < gameArea.x) {
      this.direction *= -1;
      this.y += this.height;
    }
  }
}