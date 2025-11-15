import { ctx } from '../../game.js';

export class Monster {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.image = image;
    this.speed = 1;
    this.direction = 1; // 1 for right, -1 for left
  }

  draw() {
    if (this.image) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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