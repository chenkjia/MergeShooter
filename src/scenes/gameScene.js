const { systemInfo, resourceManager, ctx } = require('../core/context.js');
const { threeSliceRects } = require('../core/slices.js');
const { computeAreaRects } = require('../core/layout.js');
const TurretArea = require('../areas/TurretArea.js');
const ButtonArea = require('../areas/ButtonArea.js');
const { on, emit } = require('../core/events.js');

const gameState = { bottomButtons: [], money: 10000 };

const gameScene = {
  isInitialized: false,
  turretArea: null,
  buttonArea: null,
  initialize() {
    if (this.isInitialized) return;
    const screenWidth = systemInfo.windowWidth;
    const screenHeight = systemInfo.windowHeight;
    const rects = computeAreaRects(screenWidth, screenHeight);
    this.turretArea = new TurretArea(rects.turret);
    this.turretArea.initialize();
    this.buttonArea = new ButtonArea(rects.buttons);
    this.buttonArea.initialize();
    on('button_click', this.handleBottomButtonClick.bind(this));
    this.isInitialized = true;
  },

  

  drawMoney() {
    const scale = 0.3;
    const barX = 0;
    const barY = 10;
    const text = gameState.money.toString();
    const img = resourceManager.textures.money_bar;
    if (!img) return;
    // 三切图绘制金币条：左端圆角，中段拉伸，右端圆角
    const barHeight = img.height * scale;
    const horizontalPadding = 10;
    ctx.font = `bold ${Math.floor(barHeight * 0.6)}px Helvetica`;
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const totalWidth = barHeight + textWidth + horizontalPadding * 2;
    const rects = threeSliceRects(img.width, img.height, totalWidth, barHeight, img.height);
    for (let k = 0; k < rects.length; k++) {
      const r = rects[k];
      ctx.drawImage(img, r.sx, r.sy, r.sw, r.sh, barX + r.dx, barY + r.dy, r.dw, r.dh);
    }
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const textX = barX + totalWidth - horizontalPadding;
    const textY = barY + barHeight / 2;
    ctx.strokeText(text, textX, textY);
    ctx.fillText(text, textX, textY);
  },

  drawThreeSlice() {},


  drawNineSlice(img, dx, dy, dw, dh, s) {
    const sw = img.width || dw;
    const sh = img.height || dh;
    let l = s, r = s, t = s, b = s;
    const maxL = Math.floor(sw / 2) - 1;
    const maxT = Math.floor(sh / 2) - 1;
    const maxDw = Math.floor(dw / 2) - 1;
    const maxDh = Math.floor(dh / 2) - 1;
    l = Math.max(1, Math.min(l, maxL, maxDw));
    r = l;
    t = Math.max(1, Math.min(t, maxT, maxDh));
    b = t;
    const scw = sw - l - r;
    const sch = sh - t - b;
    const dcw = dw - l - r;
    const dch = dh - t - b;
    ctx.drawImage(img, 0, 0, l, t, dx, dy, l, t);
    ctx.drawImage(img, l, 0, scw, t, dx + l, dy, dcw, t);
    ctx.drawImage(img, sw - r, 0, r, t, dx + dw - r, dy, r, t);
    ctx.drawImage(img, 0, t, l, sch, dx, dy + t, l, dch);
    ctx.drawImage(img, l, t, scw, sch, dx + l, dy + t, dcw, dch);
    ctx.drawImage(img, sw - r, t, r, sch, dx + dw - r, dy + t, r, dch);
    ctx.drawImage(img, 0, sh - b, l, b, dx, dy + dh - b, l, b);
    ctx.drawImage(img, l, sh - b, scw, b, dx + l, dy + dh - b, dcw, b);
    ctx.drawImage(img, sw - r, sh - b, r, b, dx + dw - r, dy + dh - b, r, b);
  },

  

  

  draw() {
    if (!this.isInitialized) this.initialize();
    ctx.clearRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
    ctx.fillStyle = '#44a5c8';
    ctx.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
    if (this.turretArea) this.turretArea.draw();
    if (this.buttonArea) this.buttonArea.draw();
    this.drawMoney();
  },

  handleBottomButtonClick(button) {
    if (gameState.money >= button.cost) {
      gameState.money -= button.cost;
      emit(button.type, button);
    }
  },

  onTouchStart(touches) {
    // 先路由到炮塔区域以支持拾取拖拽，再路由到按钮区域处理点击
    if (this.turretArea && typeof this.turretArea.onTouchStart === 'function') {
      this.turretArea.onTouchStart(touches);
    }
    if (this.buttonArea && typeof this.buttonArea.onTouchStart === 'function') {
      this.buttonArea.onTouchStart(touches);
    }
  },

  update() {
    if (this.turretArea) this.turretArea.update();
  },
  onTouchMove(touches) {
    if (this.turretArea && typeof this.turretArea.onTouchMove === 'function') {
      this.turretArea.onTouchMove(touches);
    }
  },
  onTouchEnd(touches) {
    // 分发触摸结束事件，完成拖拽释放与按钮态复位
    if (this.turretArea && typeof this.turretArea.onTouchEnd === 'function') {
      this.turretArea.onTouchEnd(touches);
    }
    if (this.buttonArea && typeof this.buttonArea.onTouchEnd === 'function') {
      this.buttonArea.onTouchEnd(touches);
    }
  },
  reset() {
    this.isInitialized = false;
    this.initialize();
    this.isInitialized = true;
  }
};

module.exports = gameScene;