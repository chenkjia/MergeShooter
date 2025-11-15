import { systemInfo, ctx } from '../../game.js';

export const gameScene = {
  draw() {
    ctx.clearRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('游戏主场景', 100, 100);
  },
  onTouchStart(touches, switchScene) {
    // 游戏主场景的触摸事件
  },
};