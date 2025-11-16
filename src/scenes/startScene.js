import { systemInfo, pixiApp, resourceManager, ctx } from '../core/context.js';

const startButton = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

export const startScene = {
  started: false,
  highestScore: 0,
  container: null,
  bg: null,
  overlay: null,
  popup: null,
  titleSprite: null,
  startBtnSprite: null,
  startBtnText: null,
  update() {
    
  },
  draw() {
    const tex = resourceManager.textures;
    if (!tex.mainBg || !tex.popupBg || !tex.title || !tex.startButton) return;
    if (!pixiApp || typeof PIXI === 'undefined') {
      ctx.clearRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
      ctx.save();
      ctx.filter = 'blur(4px)';
      ctx.drawImage(tex.mainBg, 0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
      ctx.restore();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
      const popupWidth = systemInfo.windowWidth * 0.8;
      const popupHeight = popupWidth * (tex.popupBg.height / tex.popupBg.width);
      const popupX = (systemInfo.windowWidth - popupWidth) / 2;
      const popupY = (systemInfo.windowHeight - popupHeight) / 2;
      ctx.drawImage(tex.popupBg, popupX, popupY, popupWidth, popupHeight);
      const titleWidth = popupWidth * 1.1;
      const titleHeight = titleWidth * (tex.title.height / tex.title.width);
      const titleX = (systemInfo.windowWidth - titleWidth) / 2;
      const titleY = popupY - popupHeight * 0.25;
      ctx.drawImage(tex.title, titleX, titleY, titleWidth, titleHeight);
      const startButtonWidth = popupWidth * 0.8;
      const startButtonHeight = startButtonWidth * (tex.startButton.height / tex.startButton.width);
      const startButtonX = (systemInfo.windowWidth - startButtonWidth) / 2;
      const startButtonY = titleY + titleHeight;
      ctx.drawImage(tex.startButton, startButtonX, startButtonY, startButtonWidth, startButtonHeight);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText('开始游戏', startButtonX + startButtonWidth / 2, startButtonY + startButtonHeight / 2);
      ctx.fillText('开始游戏', startButtonX + startButtonWidth / 2, startButtonY + startButtonHeight / 2);
      startButton.x = startButtonX;
      startButton.y = startButtonY;
      startButton.width = startButtonWidth;
      startButton.height = startButtonHeight;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(`历史最高积分：${this.highestScore}`, systemInfo.windowWidth / 2, startButtonY + startButtonHeight + 20);
      ctx.fillText(`历史最高积分：${this.highestScore}`, systemInfo.windowWidth / 2, startButtonY + startButtonHeight + 20);
      return;
    }
    if (!this.container) return;
    const popupWidth = systemInfo.windowWidth * 0.8;
    const popupHeight = popupWidth * (tex.popupBg.height / tex.popupBg.width);
    const popupX = (systemInfo.windowWidth - popupWidth) / 2;
    const popupY = (systemInfo.windowHeight - popupHeight) / 2;
    this.bg.width = systemInfo.windowWidth;
    this.bg.height = systemInfo.windowHeight;
    this.overlay.clear();
    this.overlay.beginFill(0x000000, 0.2);
    this.overlay.drawRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
    this.overlay.endFill();
    this.popup.x = popupX;
    this.popup.y = popupY;
    this.popup.width = popupWidth;
    this.popup.height = popupHeight;
    const titleWidth = popupWidth * 1.1;
    const titleHeight = titleWidth * (tex.title.height / tex.title.width);
    const titleX = (systemInfo.windowWidth - titleWidth) / 2;
    const titleY = popupY - popupHeight * 0.25;
    this.titleSprite.x = titleX;
    this.titleSprite.y = titleY;
    this.titleSprite.width = titleWidth;
    this.titleSprite.height = titleHeight;
    const startButtonWidth = popupWidth * 0.8;
    const startButtonHeight = startButtonWidth * (tex.startButton.height / tex.startButton.width);
    const startButtonX = (systemInfo.windowWidth - startButtonWidth) / 2;
    const startButtonY = titleY + titleHeight;
    this.startBtnSprite.x = startButtonX;
    this.startBtnSprite.y = startButtonY;
    this.startBtnSprite.width = startButtonWidth;
    this.startBtnSprite.height = startButtonHeight;
    this.startBtnText.x = startButtonX + startButtonWidth / 2;
    this.startBtnText.y = startButtonY + startButtonHeight / 2;
    startButton.x = startButtonX;
    startButton.y = startButtonY;
    startButton.width = startButtonWidth;
    startButton.height = startButtonHeight;
  },

  onTouchStart(touches, switchScene) {
    if (this.started) return;
    const touch = touches[0];
    if (
      touch.clientX >= startButton.x &&
      touch.clientX <= startButton.x + startButton.width &&
      touch.clientY >= startButton.y &&
      touch.clientY <= startButton.y + startButton.height
    ) {
      this.started = true;
      switchScene('game');
    }
  },
  onTouchMove(touches) {
    
  },
  onTouchEnd(touches) {
    
  },
  initialize() {
    try {
      const saved = tt.getStorageSync('highestScore');
      if (typeof saved === 'number') {
        this.highestScore = saved;
      }
    } catch (_) {}
    if (!pixiApp || typeof PIXI === 'undefined') return;
    const tex = resourceManager.textures;
    this.container = new PIXI.Container();
    this.bg = new PIXI.Sprite(tex.mainBg);
    this.bg.filters = [new PIXI.filters.BlurFilter(4)];
    this.overlay = new PIXI.Graphics();
    this.popup = new PIXI.Sprite(tex.popupBg);
    this.titleSprite = new PIXI.Sprite(tex.title);
    this.startBtnSprite = new PIXI.Sprite(tex.startButton);
    this.startBtnText = new PIXI.Text('开始游戏', {fontFamily: 'Arial', fontSize: 32, fontWeight: 'bold', fill: 0xFFFFFF, stroke: 0x000000, strokeThickness: 4});
    this.startBtnText.anchor.set(0.5);
    this.container.addChild(this.bg);
    this.container.addChild(this.overlay);
    this.container.addChild(this.popup);
    this.container.addChild(this.titleSprite);
    this.container.addChild(this.startBtnSprite);
    this.container.addChild(this.startBtnText);
    pixiApp.stage.addChild(this.container);
  },
};