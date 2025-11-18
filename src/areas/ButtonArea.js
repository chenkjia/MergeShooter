const { ctx, resourceManager } = require('../core/context.js');
const { nineSliceRects } = require('../core/slices.js');
const { emit, on } = require('../core/events.js');
const { hitButton } = require('../core/hit.js');

class ButtonArea {
  constructor(bounds) {
    this.bounds = bounds;
    this.container = null;
    this.bg = null;
    this.buttons = [];
    this.isTurretSlotsFull = false;
  }

  initialize() {
    this.createButtons();
    on('turret_slots_full', (isFull) => {
      this.isTurretSlotsFull = isFull;
      this.updateButtonStates();
    });
  }

  draw() {
    ctx.fillStyle = '#34567899';
    ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    for (let i = 0; i < this.buttons.length; i++) {
      const b = this.buttons[i];
      const tex = b.isPressed && b.pressedTexture ? b.pressedTexture : (b.disabled && b.disabledTexture ? b.disabledTexture : b.normalTexture);
      if (tex && tex.width && tex.height) {
        const rects = nineSliceRects(tex.width, tex.height, b.width, b.height, b.slice);
        for (let k = 0; k < rects.length; k++) {
          const r = rects[k];
          ctx.drawImage(tex, r.sx, r.sy, r.sw, r.sh, b.x + r.dx, b.y + r.dy, r.dw, r.dh);
        }
      } else {
        ctx.fillStyle = b.disabled ? '#888888' : '#2b8bd8';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        const r = 8;
        const x = b.x, y = b.y, w = b.width, h = b.height;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      const iconImg = resourceManager.textures[b.iconKey];
      if (iconImg && iconImg.width && iconImg.height) {
        const maxIconW = Math.floor(b.width * 0.6);
        const maxIconH = Math.floor(b.height * 0.6);
        const iw = iconImg.width;
        const ih = iconImg.height;
        const scale = Math.min(maxIconW / iw, maxIconH / ih);
        const dw = Math.max(1, Math.floor(iw * scale));
        const dh = Math.max(1, Math.floor(ih * scale));
        const dx = Math.floor(b.x + 10);
        const dy = Math.floor(b.y + (b.height - dh) / 2);
        ctx.drawImage(iconImg, dx, dy, dw, dh);
      }
      if (b.cost > 0) {
        ctx.font = 'bold 18px Helvetica';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#FFFFFF';
        const padding = 10;
        const tx = b.x + b.width - padding;
        const ty = b.y + Math.floor(b.height / 2);
        const text = String(b.cost);
        ctx.strokeText(text, tx, ty);
        ctx.fillText(text, tx, ty);
      }
    }
  }

  update() {}

  onTouchMove() {}

  onTouchStart(touches) {
    const t = touches && touches[0];
    if (!t) return;
    const x = t.clientX;
    const y = t.clientY;
    const idx = hitButton(this.buttons, x, y);
    if (idx >= 0) {
      const b = this.buttons[idx];
      if (b.disabled) return;
      emit('button_click', b);
      b.isPressed = true;
      setTimeout(() => { b.isPressed = false; }, 150);
    }
  }

  onTouchEnd() {}

  updateButtonStates() {
    for (let i = 0; i < this.buttons.length; i++) {
      const b = this.buttons[i];
      if (b.type === 'spawn_tank') {
        b.disabled = this.isTurretSlotsFull;
      }
    }
  }

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
        cost: [0, 1, 2, 0][i],
        isPressed: false,
        slice: 16,
        iconKey: iconKeys[i],
        pressedTexture: tex[styleKey + '_pressed'] || null,
        disabledTexture: tex[styleKey + '_disabled'] || null,
        normalTexture: tex[styleKey] || null,
        display: null,
        icon: null,
      };
      this.buttons.push(btn);
      
      x += w + spacing;
    }
  }

  

  drawButtonsPixi() {}

  drawNineSlice() {}


  
}

module.exports = ButtonArea;
