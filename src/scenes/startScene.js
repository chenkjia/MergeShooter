import { systemInfo, ctx, resourceManager } from '../../game.js';

const startButton = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

export const startScene = {
  draw() {
    ctx.clearRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);

    const { mainBg, popupBg, title, startButton: startButtonImg } = resourceManager.images;

    // 1. Draw blurred background
    if (mainBg) {
      ctx.save();
      ctx.filter = 'blur(4px)';
      ctx.drawImage(mainBg, 0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
      ctx.restore();
    } else {
      return;
    }

    // 2. Draw a semi-transparent overlay to darken the background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);

    if (!popupBg || !title || !startButtonImg) {
      console.error("弹窗资源未加载完成");
      return;
    }

    // 3. Calculate popup dimensions
    const popupWidth = systemInfo.windowWidth * 0.8;
    const popupHeight = popupWidth * (popupBg.height / popupBg.width);
    const popupX = (systemInfo.windowWidth - popupWidth) / 2;
    const popupY = (systemInfo.windowHeight - popupHeight) / 2;

    // 4. Draw the popup itself
    ctx.drawImage(popupBg, popupX, popupY, popupWidth, popupHeight);

    // 5. Draw title
    const titleWidth = popupWidth * 1.1;
    const titleHeight = titleWidth * (title.height / title.width);
    const titleX = (systemInfo.windowWidth - titleWidth) / 2;
    const titleY = popupY - popupHeight * 0.25;
    ctx.drawImage(title, titleX, titleY, titleWidth, titleHeight);

    // 6. Draw start button
    const startButtonWidth = popupWidth * 0.8;
    const startButtonHeight = startButtonWidth * (startButtonImg.height / startButtonImg.width);
    const startButtonX = (systemInfo.windowWidth - startButtonWidth) / 2;
    const startButtonY = titleY + titleHeight + 30;
    ctx.drawImage(startButtonImg, startButtonX, startButtonY, startButtonWidth, startButtonHeight);

    // 7. Update button coordinates for hit detection
    startButton.x = startButtonX;
    startButton.y = startButtonY;
    startButton.width = startButtonWidth;
    startButton.height = startButtonHeight;
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
      switchScene('game');
    }
  },
};