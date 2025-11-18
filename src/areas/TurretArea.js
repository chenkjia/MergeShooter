const { styles } = require('../core/styles.js');
const { ctx, systemInfo, resourceManager } = require('../core/context.js');
const { levels, maxLevel } = require('../data/cannons.js');
const { on, emit } = require('../core/events.js');
const TurretSlot = require('../entities/turretSlot.js');
const { computeDropResult } = require('../core/mergeLogic.js');

class TurretArea {
  constructor(bounds) {
    // 区域边界（用于绘制与触摸命中）
    this.bounds = bounds;
    this.container = null;
    this.bg = null;
    // 炮塔槽位集合
    this.slots = [];
    // 战斗用炮塔实例集合（预留）
    this.tanks = [];
    // 拖拽相关状态
    this.draggingTank = null;
    this.dragSprite = null;
    this.dragStartSlot = null;
    this.dragOverSlot = null;
  }

  initialize() {
    // 创建槽位网格并订阅生产事件
    this.createGrid();
    on('spawn_tank', this.spawnTank.bind(this));
  }

  createGrid() {
    // 根据样式配置计算居中网格布局
    const rows = styles.turret.rows;
    const cols = styles.turret.cols;
    const spacing = styles.turret.spacing;
    const cellW = styles.turret.outerSize;
    const totalW = cols * cellW + (cols - 1) * spacing;
    const totalH = rows * cellW + (rows - 1) * spacing;
    const startX = this.bounds.x + Math.floor((this.bounds.width - totalW) / 2) + cellW / 2;
    const startY = this.bounds.y + Math.floor((this.bounds.height - totalH) / 2) + cellW / 2;
    this.slots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (cellW + spacing);
        const y = startY + r * (cellW + spacing);
        const slot = new TurretSlot(x, y);
        this.slots.push(slot);
        
      }
    }
  }

  draw() {
    // 绘制炮塔区域背景与边框
    ctx.fillStyle = `#${styles.colors.turretBg.toString(16)}`;
    ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    ctx.strokeStyle = '#00000033';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    // 绘制所有槽位
    for (let i = 0; i < this.slots.length; i++) this.slots[i].drawCanvas();
    // 绘制拖拽中的炮塔贴图（随指针移动）
    if (this.draggingTank) {
      const def = levels[this.draggingTank.level] || null;
      const tankImg = def ? resourceManager.textures[def.textureKey] : null;
      if (tankImg) {
        const tankSize = styles.turret.innerSize * 0.8;
        ctx.drawImage(tankImg, this.draggingTank.x - tankSize / 2, this.draggingTank.y - tankSize / 2, tankSize, tankSize);
      }
    }
    for (let i = 0; i < this.tanks.length; i++) this.tanks[i].draw();
  }

  update() {
    // 广播槽位是否已满：用于禁用生产按钮
    const isFull = this.slots.every(s => s.isOccupied());
    if (isFull !== this.wasFull) {
      emit('turret_slots_full', isFull);
      this.wasFull = isFull;
    }
  }

  onTouchMove(touches) {
    const t = touches && touches[0];
    if (!t) return;
    const x = t.clientX;
    const y = t.clientY;
    // 槽位悬停高亮与记录
    this.dragOverSlot = null;
    for (let i = 0; i < this.slots.length; i++) {
      const s = this.slots[i];
      if (s.contains(x, y)) {
        s.setState('hover');
        this.dragOverSlot = s;
      } else {
        s.setState('default');
      }
    }
    // 更新拖拽图标位置
    if (this.draggingTank) {
      this.draggingTank.x = x;
      this.draggingTank.y = y;
    }
  }

  onTouchStart(touches) {
    const t = touches && touches[0];
    if (!t) return;
    const x = t.clientX;
    const y = t.clientY;
    // 命中已占用槽位则开始拖拽（取出炮塔）
    for (let i = 0; i < this.slots.length; i++) {
      const s = this.slots[i];
      if (s.contains(x, y) && s.isOccupied()) {
        this.draggingTank = s.tank;
        this.dragStartSlot = s;
        s.tank = null;
        break;
      }
    }
  }
  onTouchEnd() {
    // 计算拖拽释放结果并执行占位/合并/回退
    const res = computeDropResult(this.draggingTank, this.dragStartSlot, this.dragOverSlot);
    if (res.type === 'merge') {
      this.dragOverSlot.occupy(res.level);
    } else if (res.type === 'move_to') {
      this.dragOverSlot.occupy(res.level);
    } else if (res.type === 'move_back') {
      this.dragStartSlot.occupy(this.draggingTank.level);
    }
    // 清理拖拽状态
    this.draggingTank = null;
    this.dragStartSlot = null;
    this.dragOverSlot = null;
    
  }

  spawnTank() {
    const emptySlot = this.slots.find(s => !s.isOccupied());
    if (emptySlot) {
      emptySlot.occupy(1);
    }
  }
}

module.exports = TurretArea;