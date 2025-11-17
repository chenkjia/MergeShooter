import { pixiApp, ctx, systemInfo, resourceManager } from '../core/context.js';

export class ButtonArea {
  constructor(bounds) {
    this.bounds = bounds;
    this.container = null;
    this.bg = null;
    this.buttons = [];
  }
  initialize() {
    if (pixiApp && typeof PIXI !== 'undefined') {
      this.container = new PIXI.Container();
      this.bg = new PIXI.Graphics();
      this.container.addChild(this.bg);
      pixiApp.stage.addChild(this.container);
    }
    this.createButtons();
  }
  draw() {
    if (pixiApp && typeof PIXI !== 'undefined') {
      this.bg.clear();
      this.bg.beginFill(0x345678, 0.6);
      this.bg.drawRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
      this.bg.endFill();
      this.drawButtonsPixi();
    } else {
      ctx.fillStyle = '#34567899';
      ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
      this.drawButtonsCanvas();
    }
  }
  update() {}
  onTouchMove() {}
  onTouchStart(touches) {
    const t = touches && touches[0];
    if (!t) return;
    const x = t.clientX;
    const y = t.clientY;
    for (let i = 0; i < this.buttons.length; i++) {
      const b = this.buttons[i];
      const hit = x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;
      if (hit) {
        b.isPressed = true;
        if (pixiApp && typeof PIXI !== 'undefined' && b.display) {
          b.display.texture = b.pressedTexture || b.normalTexture;
        }
        setTimeout(() => { b.isPressed = false; if (pixiApp && typeof PIXI !== 'undefined' && b.display) { b.display.texture = b.normalTexture; } }, 150);
        break;
      }
    }
  }
  onTouchEnd() {}

  createButtons() {
    const spacing = 5;
    const buttonHeight = 60;
    const edgeWidth = 60;
    const numButtons = 4;
    const totalSpacing = spacing * (numButtons + 1);
    const remainingWidth = Math.max(0, this.bounds.width - totalSpacing - edgeWidth * 2);
    const middleWidth = Math.floor(remainingWidth / 2);
    const widths = [edgeWidth, middleWidth, middleWidth, edgeWidth];
    const startY = this.bounds.y + Math.floor((this.bounds.height - buttonHeight) / 2);
    let x = this.bounds.x + spacing;
    const iconKeys = ['store_icon', 'tank_icon', 'shield_icon', 'trash_icon'];
    const tex = resourceManager.textures;
    this.buttons = [];
    for (let i = 0; i < numButtons; i++) {
      const w = widths[i];
      const styleKey = i === 1 ? 'bottom_button_02' : (i === 2 ? 'bottom_button_03' : (i === 0 ? 'bottom_button_01' : 'bottom_button_04'));
      const btn = {
        x,
        y: startY,
        width: w,
        height: buttonHeight,
        type: ['shop', 'spawn_tank', 'upgrade', 'energy'][i],
        isPressed: false,
        slice: 16,
        iconKey: iconKeys[i],
        pressedTexture: tex[styleKey + '_pressed'] || null,
        normalTexture: tex[styleKey] || null,
        display: null,
        icon: null,
      };
      this.buttons.push(btn);
      if (pixiApp && typeof PIXI !== 'undefined') {
        const plane = new PIXI.NineSlicePlane(tex[styleKey], 16, 16, 16, 16);
        plane.x = btn.x;
        plane.y = btn.y;
        plane.width = btn.width;
        plane.height = btn.height;
        const iconSprite = new PIXI.Sprite(tex[btn.iconKey]);
        const maxIconW = Math.floor(btn.width * 0.6);
        const maxIconH = Math.floor(btn.height * 0.6);
        const iw = iconSprite.texture.width || maxIconW;
        const ih = iconSprite.texture.height || maxIconH;
        const scale = Math.min(maxIconW / iw, maxIconH / ih);
        iconSprite.width = Math.max(1, Math.floor(iw * scale));
        iconSprite.height = Math.max(1, Math.floor(ih * scale));
        iconSprite.x = Math.floor(btn.x + 10);
        iconSprite.y = Math.floor(btn.y + (btn.height - iconSprite.height) / 2);
        this.container.addChild(plane);
        this.container.addChild(iconSprite);
        btn.display = plane;
        btn.icon = iconSprite;
      }
      x += w + spacing;
    }
  }

  drawButtonsCanvas() {
    const tex = resourceManager.textures;
    for (let i = 0; i < this.buttons.length; i++) {
      const b = this.buttons[i];
      const img = b.isPressed && b.pressedTexture ? b.pressedTexture : b.normalTexture;
      if (img) this.drawNineSlice(img, b.x, b.y, b.width, b.height, b.slice);
      const iconImg = tex[b.iconKey];
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
      }
    }
  }

  drawButtonsPixi() {
    for (let i = 0; i < this.buttons.length; i++) {
      const b = this.buttons[i];
      if (!b.display) continue;
      b.display.texture = b.isPressed && b.pressedTexture ? b.pressedTexture : b.normalTexture;
      b.display.x = b.x;
      b.display.y = b.y;
      b.display.width = b.width;
      b.display.height = b.height;
      if (b.icon) {
        const maxIconW = Math.floor(b.width * 0.6);
        const maxIconH = Math.floor(b.height * 0.6);
        const iw = b.icon.texture.width || maxIconW;
        const ih = b.icon.texture.height || maxIconH;
        const scale = Math.min(maxIconW / iw, maxIconH / ih);
        const dw = Math.max(1, Math.floor(iw * scale));
        const dh = Math.max(1, Math.floor(ih * scale));
        const dx = Math.floor(b.x + 10);
        const dy = Math.floor(b.y + (b.height - dh) / 2);
        b.icon.width = dw;
        b.icon.height = dh;
        b.icon.x = dx;
        b.icon.y = dy;
      }
    }
  }

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
  }
}
