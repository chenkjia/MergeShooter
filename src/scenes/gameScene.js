import { systemInfo, pixiApp, resourceManager, ctx } from '../core/context.js';
import { computeAreaRects } from '../core/layout.js';
import { TurretArea } from '../areas/TurretArea.js';
import { ButtonArea } from '../areas/ButtonArea.js';
import { on, emit } from '../core/events.js';

const gameState = { bottomButtons: [], money: 10000 };

export const gameScene = {
  isInitialized: false,
  container: null,
  bgRect: null,
  moneyBarSprite: null,
  moneyText: null,
  turretArea: null,
  buttonArea: null,
  initialize() {
    if (this.isInitialized) return;
    const screenWidth = systemInfo.windowWidth;
    const screenHeight = systemInfo.windowHeight;
    if (pixiApp && typeof PIXI !== 'undefined' && !this.container) {
      this.container = new PIXI.Container();
      this.bgRect = new PIXI.Graphics();
      this.moneyBarSprite = new PIXI.Sprite(resourceManager.textures.money_bar);
      this.moneyText = new PIXI.Text('', {fontFamily: 'Helvetica', fontSize: 24, fontWeight: 'bold', fill: 0xFFFFFF, stroke: 0x000000, strokeThickness: 3});
      this.moneyText.anchor.set(1, 0.5);
      this.container.addChild(this.bgRect);
      this.container.addChild(this.moneyBarSprite);
      this.container.addChild(this.moneyText);
      pixiApp.stage.addChild(this.container);
    }
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
    if (pixiApp && typeof PIXI !== 'undefined' && this.moneyBarSprite) {
      const barHeight = this.moneyBarSprite.texture.height * scale;
      this.moneyBarSprite.x = barX;
      this.moneyBarSprite.y = barY;
      this.moneyBarSprite.height = barHeight;
      const horizontalPadding = 10;
      this.moneyText.style.fontSize = Math.floor(barHeight * 0.6);
      this.moneyText.text = text;
      const totalWidth = this.moneyText.width + horizontalPadding * 2 + barHeight;
      this.moneyBarSprite.width = totalWidth;
      this.moneyText.x = barX + totalWidth - horizontalPadding;
      this.moneyText.y = barY + barHeight / 2;
    } else {
      const img = resourceManager.textures.money_bar;
      if (!img) return;
      const barHeight = img.height * scale;
      const horizontalPadding = 10;
      ctx.font = `bold ${Math.floor(barHeight * 0.6)}px Helvetica`;
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const totalWidth = barHeight + textWidth + horizontalPadding * 2;
      this.drawThreeSlice(img, barX, barY, totalWidth, barHeight, img.height);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const textX = barX + totalWidth - horizontalPadding;
      const textY = barY + barHeight / 2;
      ctx.strokeText(text, textX, textY);
      ctx.fillText(text, textX, textY);
    }
  },

  drawThreeSlice(img, dx, dy, dw, dh, sliceWidth) {
    const img_sw = img.width;
    const img_sh = img.height;
    const cap_dw = sliceWidth * (dh / img_sh);
    ctx.drawImage(img, 0, 0, sliceWidth, img_sh, dx, dy, cap_dw, dh);
    const middle_sw = img_sw - sliceWidth * 2;
    const middle_dw = dw - cap_dw * 2;
    if (middle_dw > 0) {
      ctx.drawImage(img, sliceWidth, 0, middle_sw, img_sh, dx + cap_dw, dy, middle_dw, dh);
    }
    ctx.drawImage(img, img_sw - sliceWidth, 0, sliceWidth, img_sh, dx + dw - cap_dw, dy, cap_dw, dh);
  },


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
    if (pixiApp && typeof PIXI !== 'undefined') {
      this.bgRect.clear();
      this.bgRect.beginFill(0x44a5c8);
      this.bgRect.drawRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
      this.bgRect.endFill();
      if (this.turretArea) this.turretArea.draw();
      if (this.buttonArea) this.buttonArea.draw();
      this.drawMoney();
    } else {
      ctx.clearRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
      ctx.fillStyle = '#44a5c8';
      ctx.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
      if (this.turretArea) this.turretArea.draw();
      if (this.buttonArea) this.buttonArea.draw();
      this.drawMoney();
    }
  },

  handleBottomButtonClick(button) {
    if (gameState.money >= button.cost) {
      gameState.money -= button.cost;
      emit(button.type, button);
    }
  },

  onTouchStart(touches) {
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
  onTouchEnd() {},
  reset() {
    this.isInitialized = false;
    this.initialize();
    this.isInitialized = true;
  }
};