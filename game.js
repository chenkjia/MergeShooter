let systemInfo = tt.getSystemInfoSync();
let canvas = tt.createCanvas(),
  ctx = canvas.getContext('2d');
canvas.width = systemInfo.windowWidth;
canvas.height = systemInfo.windowHeight;
// canvas.style.width = systemInfo.windowWidth + 'px';
// canvas.style.height = systemInfo.windowHeight + 'px';

const startButton = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

function drawImage(src, x, y, width, height, isButton = false) {
  const image = tt.createImage();
  image.src = src;
  image.onload = () => {
    ctx.drawImage(image, x, y, width, height);
    if (isButton) {
      startButton.x = x;
      startButton.y = y;
      startButton.width = width;
      startButton.height = height;
    }
  };
}

function draw() {
  // Draw background
  drawImage('src/assets/ui/game_area_bg.png', 0, 0, systemInfo.windowWidth, systemInfo.windowHeight);

  // Draw title
  const titleWidth = systemInfo.windowWidth * 0.8;
  const titleHeight = titleWidth * (334 / 834);
  const titleX = (systemInfo.windowWidth - titleWidth) / 2;
  const titleY = systemInfo.windowHeight * 0.2;
  drawImage('src/assets/ui/title.png', titleX, titleY, titleWidth, titleHeight);

  // Draw start button
  const startButtonWidth = systemInfo.windowWidth * 0.6;
  const startButtonHeight = startButtonWidth * (206 / 626);
  const startButtonX = (systemInfo.windowWidth - startButtonWidth) / 2;
  const startButtonY = titleY + titleHeight + 50;
  drawImage('src/assets/ui/start_game_btn.png', startButtonX, startButtonY, startButtonWidth, startButtonHeight, true);
}

tt.onTouchStart(({ touches }) => {
  const touch = touches[0];
  if (
    touch.clientX >= startButton.x &&
    touch.clientX <= startButton.x + startButton.width &&
    touch.clientY >= startButton.y &&
    touch.clientY <= startButton.y + startButton.height
  ) {
    console.log('游戏开始');
  }
});

draw();