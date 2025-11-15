import { systemInfo, ctx, resourceManager } from '../../game.js';
import { Monster } from '../entities/monster.js';

export const gameScene = {
  monsters: [],
  layout: {
    gameArea: {
      x: 50,
      y: 100,
      width: systemInfo.windowWidth - 100,
      height: systemInfo.windowHeight - 200,
    },
  },
  isInitialized: false,

  initialize() {
    if (this.isInitialized) return;

    const monsterImg = resourceManager.images.monster1;
    if (monsterImg) {
      const monster = new Monster(100, 150, monsterImg);
      this.monsters.push(monster);
    }
    this.isInitialized = true;
  },

  update() {
    this.monsters.forEach(monster => monster.update(this.layout.gameArea));
  },

  draw() {
    this.initialize();
    ctx.clearRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);

    const mainBg = resourceManager.images.mainBg;
    if (mainBg) {
      ctx.drawImage(mainBg, 0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
    }

    this.monsters.forEach(monster => monster.draw());

    // For debugging: draw the game area outline
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      this.layout.gameArea.x,
      this.layout.gameArea.y,
      this.layout.gameArea.width,
      this.layout.gameArea.height
    );
  },
  onTouchStart(touches, switchScene) {
    // 游戏主场景的触摸事件
  },
};