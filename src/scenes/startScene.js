import { systemInfo, ctx, resourceManager } from '../../game.js';

const startButton = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

function drawMainBackground() {
  if (resourceManager.images.mainBg) {
    ctx.drawImage(resourceManager.images.mainBg, 0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
  }
}

function drawFrostedGlass() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
}

function drawStartPopup() {
  const { popupBg, title, startButton: startButtonImg } = resourceManager.images;
  if (!popupBg || !title || !startButtonImg) {
    console.error("弹窗资源未加载完成");
    return;
  }

  const popupWidth = systemInfo.windowWidth * 0.9;
  const popupHeight = popupWidth * (popupBg.height / popupBg.width);
  const popupX = (systemInfo.windowWidth - popupWidth) / 2;
  const popupY = (systemInfo.windowHeight - popupHeight) / 2;
  ctx.drawImage(popupBg, popupX, popupY, popupWidth, popupHeight);

  const titleWidth = popupWidth * 0.7;
  const titleHeight = titleWidth * (title.height / title.width);
  const titleX = (systemInfo.windowWidth - titleWidth) / 2;
  const titleY = popupY + popupHeight * 0.15;
  ctx.drawImage(title, titleX, titleY, titleWidth, titleHeight);

  const startButtonWidth = popupWidth * 0.6;
  const startButtonHeight = startButtonWidth * (startButtonImg.height / startButtonImg.width);
  const startButtonX = (systemInfo.windowWidth - startButtonWidth) / 2;
  const startButtonY = titleY + titleHeight + 30;
  ctx.drawImage(startButtonImg, startButtonX, startButtonY, startButtonWidth, startButtonHeight);

  startButton.x = startButtonX;
  startButton.y = startButtonY;
  startButton.width = startButtonWidth;
  startButton.height = startButtonHeight;
}

export const startScene = {
  draw() {
    ctx.clearRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
    drawMainBackground();
    drawFrostedGlass();
    drawStartPopup();
  },
  onTouchStart(touches, switchScene) {
    const touch = touches[0];
    if (
      touch.clientX >= startButton.x &&
      touch.clientX <= startButton.x + startButton.width &&
      touch.clientY >= startButton.y &&
      touch.clientY <= startButton.y + startButton.height
    ) {
      console.log('游戏开始');
      // 切换到游戏场景
      // switchScene('game');
    }
  },
};