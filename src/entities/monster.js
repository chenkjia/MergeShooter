import { } from '../core/context.js';

export class Monster {
  constructor(x, y, image, opts = {}) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    if (typeof PIXI !== 'undefined') {
      this.texture = image ? (image.baseTexture ? new PIXI.Texture(image.baseTexture) : image) : null;
      this.sprite = this.texture ? new PIXI.Sprite(this.texture) : new PIXI.Graphics();
    } else {
      this.texture = null;
      this.sprite = null;
    }
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
    if (typeof PIXI === 'undefined' || !this.sprite) return;
    if (this.sprite instanceof PIXI.Graphics) {
      this.sprite.clear();
      this.sprite.beginFill(0xff0000);
      this.sprite.drawRect(0, 0, this.width, this.height);
      this.sprite.endFill();
    } else {
      this.sprite.width = this.width;
      this.sprite.height = this.height;
    }
    this.sprite.x = this.x;
    this.sprite.y = this.y;
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