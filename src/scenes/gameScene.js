import { systemInfo, pixiApp, resourceManager, ctx } from '../core/context.js';

const gameState = { bottomButtons: [], money: 10000 };

export const gameScene = {
  isInitialized: false,
  container: null,
  bgRect: null,
  buttonAreaRect: null,
  buttonsContainer: null,
  moneyBarSprite: null,
  moneyText: null,
  initialize() {
    if (this.isInitialized) return;
    this.initializeBottomButtons();
    this.isInitialized = true;
  },

  initializeBottomButtons() {
    const screenWidth = systemInfo.windowWidth;
    const screenHeight = systemInfo.windowHeight;
    const buttonHeight = 60;
    const bottomMargin = 20;
    const spacing = 5;
    const numButtons = 4;
    const totalSpacing = spacing * (numButtons + 1);
    const edgeWidth = 60;
    const remainingWidth = Math.max(0, screenWidth - totalSpacing - edgeWidth * 2);
    const middleWidth = remainingWidth / 2;
    const widths = [edgeWidth, middleWidth, middleWidth, edgeWidth];
    const startY = screenHeight - buttonHeight - bottomMargin;
    let x = spacing;
    gameState.bottomButtons = [];
    const iconKeys = ['store_icon', 'tank_icon', 'shield_icon', 'trash_icon'];
    const tex = resourceManager.textures;
    if (pixiApp && typeof PIXI !== 'undefined' && !this.container) {
      this.container = new PIXI.Container();
      this.bgRect = new PIXI.Graphics();
      this.buttonAreaRect = new PIXI.Graphics();
      this.buttonsContainer = new PIXI.Container();
      this.moneyBarSprite = new PIXI.Sprite(tex.money_bar);
      this.moneyText = new PIXI.Text('', {fontFamily: 'Helvetica', fontSize: 24, fontWeight: 'bold', fill: 0xFFFFFF, stroke: 0x000000, strokeThickness: 3});
      this.moneyText.anchor.set(1, 0.5);
      this.container.addChild(this.bgRect);
      this.container.addChild(this.buttonAreaRect);
      this.container.addChild(this.buttonsContainer);
      this.container.addChild(this.moneyBarSprite);
      this.container.addChild(this.moneyText);
      pixiApp.stage.addChild(this.container);
    }
    for (let i = 0; i < numButtons; i++) {
      const w = widths[i];
      const styleKey = i === 1 ? 'bottom_button_02' : (i === 2 ? 'bottom_button_03' : (i === 0 ? 'bottom_button_01' : 'bottom_button_04'));
      let plane = null;
      let iconSprite = null;
      if (pixiApp && typeof PIXI !== 'undefined') {
        plane = new PIXI.NineSlicePlane(tex[styleKey], 16, 16, 16, 16);
        plane.x = x;
        plane.y = startY;
        plane.width = w;
        plane.height = buttonHeight;
        iconSprite = new PIXI.Sprite(tex[iconKeys[i]]);
        this.buttonsContainer.addChild(plane);
        this.buttonsContainer.addChild(iconSprite);
      }
      const btn = {
        x: x,
        y: startY,
        width: w,
        height: buttonHeight,
        type: ['shop', 'spawn_tank', 'upgrade', 'energy'][i],
        isPressed: false,
        slice: 16,
        iconKey: iconKeys[i],
        cost: i === 1 ? 1 : (i === 2 ? 2 : null),
        display: plane,
        icon: iconSprite,
        pressedTexture: tex[styleKey + '_pressed'],
        normalTexture: tex[styleKey],
      };
      gameState.bottomButtons.push(btn);
      x += w + spacing;
    }
    const topPad = bottomMargin;
    const areaY = startY - topPad;
    const areaH = buttonHeight + bottomMargin + topPad;
    this.buttonArea = { x: 0, y: areaY, width: screenWidth, height: areaH };
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

  drawBottomButtons() {
    for (let i = 0; i < gameState.bottomButtons.length; i++) {
      const b = gameState.bottomButtons[i];
      const isDisabled = b.cost !== null && gameState.money < b.cost;
      b.display.alpha = isDisabled ? 0.5 : 1.0;
      b.display.texture = b.isPressed && b.pressedTexture ? b.pressedTexture : b.normalTexture;
      const maxIconW = Math.floor(b.width * 0.6);
      const maxIconH = Math.floor(b.height * 0.6);
      const iw = b.icon.texture.width || maxIconW;
      const ih = b.icon.texture.height || maxIconH;
      const scale = Math.min(maxIconW / iw, maxIconH / ih);
      const dw = Math.max(1, Math.floor(iw * scale));
      const dh = Math.max(1, Math.floor(ih * scale));
      const iconPadding = 10;
      const dx = Math.floor(b.x + iconPadding);
      const dy = Math.floor(b.y + (b.height - dh) / 2);
      b.display.x = b.x;
      b.display.y = b.y;
      b.display.width = b.width;
      b.display.height = b.height;
      b.icon.x = dx;
      b.icon.y = dy;
      b.icon.width = dw;
      b.icon.height = dh;
    }
  },

  draw() {
    if (!this.isInitialized) this.initialize();
    if (pixiApp && typeof PIXI !== 'undefined') {
      this.bgRect.clear();
      this.bgRect.beginFill(0x44a5c8);
      this.bgRect.drawRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
      this.bgRect.endFill();
      if (this.buttonArea) {
        this.buttonAreaRect.clear();
        this.buttonAreaRect.beginFill(0x467fc6);
        this.buttonAreaRect.drawRect(this.buttonArea.x, this.buttonArea.y, this.buttonArea.width, this.buttonArea.height);
        this.buttonAreaRect.endFill();
      }
      this.drawBottomButtons();
      this.drawMoney();
    } else {
      ctx.clearRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
      ctx.fillStyle = '#44a5c8';
      ctx.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
      if (this.buttonArea) {
        ctx.fillStyle = '#467fc6';
        ctx.fillRect(this.buttonArea.x, this.buttonArea.y, this.buttonArea.width, this.buttonArea.height);
      }
      for (let i = 0; i < gameState.bottomButtons.length; i++) {
        const b = gameState.bottomButtons[i];
        const isDisabled = b.cost !== null && gameState.money < b.cost;
        ctx.globalAlpha = isDisabled ? 0.5 : 1.0;
        const styleKey = i === 1 ? 'bottom_button_02' : (i === 2 ? 'bottom_button_03' : (i === 0 ? 'bottom_button_01' : 'bottom_button_04'));
        const img = b.isPressed && resourceManager.textures[styleKey + '_pressed'] ? resourceManager.textures[styleKey + '_pressed'] : resourceManager.textures[styleKey];
        const iconImg = resourceManager.textures[b.iconKey] || null;
        if (img) {
          this.drawNineSlice(img, b.x, b.y, b.width, b.height, b.slice || 16);
        } else {
          ctx.fillStyle = '#CCCCCC';
          ctx.fillRect(b.x, b.y, b.width, b.height);
        }
        if (iconImg) {
          const maxIconW = Math.floor(b.width * 0.6);
          const maxIconH = Math.floor(b.height * 0.6);
          const iw = iconImg.width || maxIconW;
          const ih = iconImg.height || maxIconH;
          const scale = Math.min(maxIconW / iw, maxIconH / ih);
          const dw = Math.max(1, Math.floor(iw * scale));
          const dh = Math.max(1, Math.floor(ih * scale));
          const dx = Math.floor(b.x + 10);
          const dy = Math.floor(b.y + (b.height - dh) / 2);
          ctx.drawImage(iconImg, dx, dy, dw, dh);
          if (b.cost !== null) {
            const text = b.cost.toString();
            const fontSize = Math.floor(b.height * 0.4);
            ctx.font = `bold ${fontSize}px Helvetica`;
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            const textX = dx + dw + 10;
            const textY = b.y + b.height / 2;
            ctx.strokeText(text, textX, textY);
            ctx.fillText(text, textX, textY);
          }
        }
        ctx.globalAlpha = 1.0;
      }
      this.drawMoney();
    }
  },

  handleBottomButtonClick(button) {
    console.log('Button clicked: ' + button.type);
  },

  onTouchStart(touches) {
    const t = touches && touches[0];
    if (!t) return;
    const touch = { x: t.clientX, y: t.clientY };
    for (let i = 0; i < gameState.bottomButtons.length; i++) {
      const b = gameState.bottomButtons[i];
      const isDisabled = b.cost !== null && gameState.money < b.cost;
      if (touch.x >= b.x && touch.x <= b.x + b.width && touch.y >= b.y && touch.y <= b.y + b.height) {
        if (isDisabled) return; // Do nothing if the button is disabled
        b.isPressed = true;
        this.handleBottomButtonClick(b);
        setTimeout(function() { b.isPressed = false; }, 200);
        return;
      }
    }
  },

  update() {},
  onTouchMove() {},
  onTouchEnd() {},
  reset() {
    this.isInitialized = false;
    this.initializeBottomButtons();
    this.isInitialized = true;
  }
};