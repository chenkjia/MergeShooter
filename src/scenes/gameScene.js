import { systemInfo, ctx, resourceManager } from '../core/context.js';

const gameState = { bottomButtons: [], money: 1 };

export const gameScene = {
  isInitialized: false,
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
    const iconKeys = ['store_icon', null, null, 'trash_icon'];
    for (let i = 0; i < numButtons; i++) {
      const w = widths[i];
      gameState.bottomButtons.push({
        x: x,
        y: startY,
        width: w,
        height: buttonHeight,
        image: resourceManager.images['bottom_button_0' + (i + 1)],
        imagePressed: resourceManager.images['bottom_button_0' + (i + 1) + '_pressed'],
        type: ['shop', 'spawn_tank', 'upgrade', 'energy'][i],
        isPressed: false,
        slice: 16,
        iconKey: iconKeys[i]
      });
      x += w + spacing;
    }
    const topPad = bottomMargin;
    const areaY = startY - topPad;
    const areaH = buttonHeight + bottomMargin + topPad;
    this.buttonArea = { x: 0, y: areaY, width: screenWidth, height: areaH };
  },

  drawMoney() {
    const moneyBarImg = resourceManager.images.money_bar;
    if (moneyBarImg && moneyBarImg.complete) {
      const scale = 0.3;
      const barX = 0;
      const barY = 10;
      const barHeight = moneyBarImg.height * scale;
      const text = gameState.money.toString();
      
      const fontSize = Math.floor(barHeight * 0.6); // A bit smaller for padding
      ctx.font = `bold ${fontSize}px Helvetica`;
      
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      
      // Assuming the source image has square caps on both ends
      const sourceCapWidth = moneyBarImg.height; 
      const destCapWidth = barHeight; 
      
      const horizontalPadding = 10; // Padding between text and caps
      const totalWidth = destCapWidth  + textWidth + horizontalPadding * 2;

      this.drawThreeSlice(moneyBarImg, barX, barY, totalWidth, barHeight, sourceCapWidth);

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // Align text to the right, before the right cap begins
      const textX = barX + totalWidth - horizontalPadding;
      const textY = barY + barHeight / 2;

      ctx.strokeText(text, textX, textY);
      ctx.fillText(text, textX, textY);
    }
  },

  drawThreeSlice(img, dx, dy, dw, dh, sliceWidth) {
    const img_sw = img.width;
    const img_sh = img.height;
    
    // Destination cap width, maintaining aspect ratio.
    const cap_dw = sliceWidth * (dh / img_sh);
    
    // Draw left cap
    ctx.drawImage(img, 0, 0, sliceWidth, img_sh, dx, dy, cap_dw, dh);
    
    // Draw middle (stretched)
    const middle_sw = img_sw - sliceWidth * 2;
    const middle_dw = dw - cap_dw * 2;
    if (middle_dw > 0) {
      ctx.drawImage(img, sliceWidth, 0, middle_sw, img_sh, dx + cap_dw, dy, middle_dw, dh);
    }
    
    // Draw right cap
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
      const img = b.isPressed && b.imagePressed ? b.imagePressed : b.image;
      if (img && img.complete) {
        const needsScale = (img.width && (img.width !== b.width || img.height !== b.height));

        // ctx.drawImage(img, b.x, b.y, b.width, b.height);
        if (needsScale) {
          this.drawNineSlice(img, b.x, b.y, b.width, b.height, b.slice || 16);
        } else {
          ctx.drawImage(img, b.x, b.y, b.width, b.height);
        }
        const iconImg = b.iconKey ? resourceManager.images[b.iconKey] : null;
        if (iconImg && iconImg.complete) {
          const maxIconW = Math.floor(b.width * 0.6);
          const maxIconH = Math.floor(b.height * 0.6);
          const iw = iconImg.width || maxIconW;
          const ih = iconImg.height || maxIconH;
          const scale = Math.min(maxIconW / iw, maxIconH / ih);
          const dw = Math.max(1, Math.floor(iw * scale));
          const dh = Math.max(1, Math.floor(ih * scale));
          const dx = Math.floor(b.x + (b.width - dw) / 2);
          const dy = Math.floor(b.y + (b.height - dh) / 2);
          ctx.drawImage(iconImg, dx, dy, dw, dh);
        }
      } else {
        ctx.fillStyle = '#CCCCCC';
        ctx.fillRect(b.x, b.y, b.width, b.height);
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(b.x, b.y, b.width, b.height);
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.type, b.x + b.width / 2, b.y + b.height / 2);
      }
    }
  },

  draw() {
    if (!this.isInitialized) this.initialize();
    ctx.clearRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
    ctx.fillStyle = '#44a5c8';
    ctx.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
    if (this.buttonArea) {
      ctx.fillStyle = '#467fc6';
      ctx.fillRect(this.buttonArea.x, this.buttonArea.y, this.buttonArea.width, this.buttonArea.height);
    }
    this.drawBottomButtons();
    this.drawMoney();
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
      if (touch.x >= b.x && touch.x <= b.x + b.width && touch.y >= b.y && touch.y <= b.y + b.height) {
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