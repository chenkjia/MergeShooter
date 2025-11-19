const { systemInfo, resourceManager, ctx } = require('../core/context.js');
const { drawTankWithBadge } = require('../core/draw.js');
const { styles } = require('../core/styles.js');
const { threeSliceRects } = require('../core/slices.js');
const { computeAreaRects } = require('../core/layout.js');
const TurretArea = require('../areas/TurretArea.js');
const ButtonArea = require('../areas/ButtonArea.js');
const ShootingArea = require('../areas/ShootingArea.js');
const MonsterPathArea = require('../areas/MonsterPathArea.js');
const { on, emit } = require('../core/events.js');

const gameState = { bottomButtons: [], money: 10000 };

const gameScene = {
  isInitialized: false,
  turretArea: null,
  buttonArea: null,
  shootingArea: null,
  monsterPathArea: null,
  initialize() {
    if (this.isInitialized) return;
    const screenWidth = systemInfo.windowWidth;
    const screenHeight = systemInfo.windowHeight;
    const rects = computeAreaRects(screenWidth, screenHeight);
    
    // 初始化怪物路径区域
    this.monsterPathArea = new MonsterPathArea(rects.monster);
    this.monsterPathArea.initialize();
    
    this.shootingArea = new ShootingArea(rects.shooting);
    this.shootingArea.initialize();
    this.turretArea = new TurretArea(rects.turret);
    this.turretArea.initialize();
    this.turretArea.setShootingArea(this.shootingArea);
    this.shootingArea.setTurretArea(this.turretArea);
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
    if (ctx && typeof ctx.setLineDash === 'function') ctx.setLineDash([]);
    
    // 绘制怪物路径区域（使用MonsterPathArea的绘制逻辑）
    if (this.monsterPathArea) this.monsterPathArea.draw();
    
    // 注意：移除原来的背景填充，因为MonsterPathArea会处理自己的背景
    // ctx.fillStyle = '#5a98c4';
    // ctx.fillRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
    
    if (this.shootingArea) this.shootingArea.draw();
    if (this.turretArea) this.turretArea.draw();
    if (this.buttonArea) this.buttonArea.draw();
    if (this.turretArea && this.turretArea.draggingTank) {
      const t = this.turretArea.draggingTank;
      drawTankWithBadge(t.x, t.y, t.level, styles.turret.innerSize);
    }
    if (this.shootingArea && this.shootingArea.draggingTank) {
      const t = this.shootingArea.draggingTank;
      drawTankWithBadge(t.x, t.y, t.level, styles.turret.innerSize);
    }
    this.drawMoney();
    this.drawPlayerHealth();
  },

  handleBottomButtonClick(button) {
    if (gameState.money >= button.cost) {
      gameState.money -= button.cost;
      emit(button.type, button);
    }
  },

  onTouchStart(touches) {
    if (this.monsterPathArea && typeof this.monsterPathArea.onTouchStart === 'function') {
      this.monsterPathArea.onTouchStart(touches);
    }
    if (this.shootingArea && typeof this.shootingArea.onTouchStart === 'function') {
      this.shootingArea.onTouchStart(touches);
    }
    if (this.turretArea && typeof this.turretArea.onTouchStart === 'function') {
      this.turretArea.onTouchStart(touches);
    }
    if (this.buttonArea && typeof this.buttonArea.onTouchStart === 'function') {
      this.buttonArea.onTouchStart(touches);
    }
  },

  update() {
    if (this.monsterPathArea) this.monsterPathArea.update();
    if (this.turretArea) this.turretArea.update();
    if (this.shootingArea) this.shootingArea.update();
  },
  onTouchMove(touches) {
    if (this.monsterPathArea && typeof this.monsterPathArea.onTouchMove === 'function') {
      this.monsterPathArea.onTouchMove(touches);
    }
    if (this.shootingArea && typeof this.shootingArea.onTouchMove === 'function') {
      this.shootingArea.onTouchMove(touches);
    }
    if (this.turretArea && typeof this.turretArea.onTouchMove === 'function') {
      this.turretArea.onTouchMove(touches);
    }
  },
  onTouchEnd(touches) {
    // 分发触摸结束事件，完成拖拽释放与按钮态复位
    if (this.monsterPathArea && typeof this.monsterPathArea.onTouchEnd === 'function') {
      this.monsterPathArea.onTouchEnd(touches);
    }
    if (this.shootingArea && typeof this.shootingArea.onTouchEnd === 'function') {
      this.shootingArea.onTouchEnd(touches);
    }
    if (this.turretArea && typeof this.turretArea.onTouchEnd === 'function') {
      this.turretArea.onTouchEnd(touches);
    }
    if (this.buttonArea && typeof this.buttonArea.onTouchEnd === 'function') {
      this.buttonArea.onTouchEnd(touches);
    }
  },
  drawPlayerHealth() {
    if (!ctx || !this.monsterPathArea) return;
    const h = this.monsterPathArea.getPlayerHealth();
    const barW = 140;
    const barH = 16;
    const x = systemInfo.windowWidth - barW - 10;
    const y = 10;
    const pct = h.max > 0 ? Math.max(0, Math.min(1, h.current / h.max)) : 0;
    ctx.fillStyle = '#333333';
    ctx.fillRect(x, y, barW, barH);
    ctx.fillStyle = '#44ff44';
    ctx.fillRect(x, y, Math.floor(barW * pct), barH);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barW, barH);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Helvetica';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${h.current}/${h.max}`, x + barW / 2, y + barH / 2);
  },
  reset() {
    this.isInitialized = false;
    this.initialize();
    this.isInitialized = true;
  }
};

module.exports = gameScene;