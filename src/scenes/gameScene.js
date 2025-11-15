import { systemInfo, ctx, resourceManager } from '../core/context.js';
import { Tank } from '../entities/tank.js';
import { Monster } from '../entities/monster.js';
import { WaveManager } from '../systems/waveManager.js';

const GRID_SIZE = 50;
const battleArea = {
  x: systemInfo.windowWidth * 0.05,
  y: systemInfo.windowHeight * 0.1,
  width: systemInfo.windowWidth * 0.9,
  height: systemInfo.windowHeight * 0.55,
};
const mergeArea = {
  x: systemInfo.windowWidth * 0.05,
  y: systemInfo.windowHeight * 0.7,
  width: systemInfo.windowWidth * 0.9,
  height: systemInfo.windowHeight * 0.2,
};

const trashArea = {
  x: systemInfo.windowWidth * 0.85,
  y: systemInfo.windowHeight * 0.15,
  width: 60,
  height: 60,
};

const gameState = {
  tanks: [],
  monsters: [],
  wave: 0,
  gold: 0,
  score: 0,
  tankLimit: 5,
  highestScore: 0,
  dragging: false,
  dragIndex: -1,
  dragOffsetX: 0,
  dragOffsetY: 0,
  battleArea,
  trashArea,
  bottomButtons: [],
};

export const gameScene = {
  isInitialized: false,
  waveManager: null,
  nextWaveTimer: null,
  resetButton: { x: 0, y: 0, w: 0, h: 0 },

  initialize() {
    if (this.isInitialized) return;
    console.log("Initializing Game Scene for Merge Tank...");

    // Add 2 initial tanks
    const tank1 = new Tank(1, 100, 300, resourceManager.images.tank_level_1);
    const tank2 = new Tank(1, 200, 300, resourceManager.images.tank_level_1);
    gameState.tanks.push(tank1, tank2);

    try {
      const saved = tt.getStorageSync('highestScore');
      if (typeof saved === 'number') {
        gameState.highestScore = saved;
      }
    } catch (_) {}
    try {
      const savedLimit = tt.getStorageSync('tankLimit');
      if (typeof savedLimit === 'number') {
        gameState.tankLimit = savedLimit;
      }
    } catch (_) {}

    this.waveManager = WaveManager();
    const createMonster = (x, y, img, opts) => new Monster(x, y, img, opts);
    this.waveManager.startFirstWave(gameState, resourceManager, createMonster);

    // 初始化底部按钮
    this.initializeBottomButtons();

    this.isInitialized = true;
  },

  drawTrashArea() {
    // 绘制垃圾桶背景
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(trashArea.x, trashArea.y, trashArea.width, trashArea.height);
    
    // 绘制垃圾桶边框
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 3;
    ctx.strokeRect(trashArea.x, trashArea.y, trashArea.width, trashArea.height);
    
    // 绘制垃圾桶图标
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('🗑️', trashArea.x + trashArea.width / 2, trashArea.y + trashArea.height / 2);
  },

  handleBottomButtonClick(button) {
    switch (button.type) {
      case 'spawn_tank':
        this.spawnNewTank();
        break;
      case 'shop':
        // TODO: 打开商店界面
        console.log('打开商店');
        break;
      case 'upgrade':
        // TODO: 实现升级功能
        if (gameState.gold >= button.cost) {
          gameState.gold -= button.cost;
          console.log('执行升级');
        } else {
          console.log('金币不足');
        }
        break;
      case 'energy':
        // TODO: 实现能量功能
        console.log('使用能量饮料');
        break;
    }
  },

  spawnNewTank() {
    const cost = 2000;
    if (gameState.gold < cost) {
      console.log('金币不足，无法生成坦克');
      return;
    }

    if (gameState.tanks.length >= gameState.tankLimit) {
      console.log('坦克数量已达上限');
      return;
    }

    // 在合并区域随机位置生成新坦克
    const gridSize = 50;
    const maxCols = Math.floor(mergeArea.width / gridSize);
    const maxRows = Math.floor(mergeArea.height / gridSize);
    
    let spawnX, spawnY;
    let attempts = 0;
    const maxAttempts = 50;
    
    // 寻找空位置
    do {
      const col = Math.floor(Math.random() * maxCols);
      const row = Math.floor(Math.random() * maxRows);
      spawnX = mergeArea.x + col * gridSize;
      spawnY = mergeArea.y + row * gridSize;
      attempts++;
    } while (attempts < maxAttempts && this.isPositionOccupied(spawnX, spawnY));

    if (attempts >= maxAttempts) {
      console.log('无法找到合适的位置生成坦克');
      return;
    }

    // 扣除金币并生成坦克
    gameState.gold -= cost;
    const newTank = new Tank(1, spawnX, spawnY, resourceManager.images.tank_level_1);
    gameState.tanks.push(newTank);
    
    console.log('成功生成新坦克');
  },

  isPositionOccupied(x, y) {
    return gameState.tanks.some(tank => 
      Math.abs(tank.x - x) < 50 && Math.abs(tank.y - y) < 50
    );
  },

  drawBottomButtons() {
    gameState.bottomButtons.forEach(button => {
      const image = button.isPressed && button.imagePressed ? button.imagePressed : button.image;
      
      if (image && image.complete) {
        // 使用真实图片绘制按钮
        ctx.drawImage(image, button.x, button.y, button.width, button.height);
      } else {
        // 如果图片未加载，使用备用绘制
        ctx.fillStyle = button.color || '#666';
        ctx.fillRect(button.x, button.y, button.width, button.height);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(button.x, button.y, button.width, button.height);
        
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(button.text || button.type, button.x + button.width / 2, button.y + button.height / 2);
      }
    });
  },

  update() {
    gameState.tanks.forEach(tank => tank.update(gameState.monsters));
    for (let i = 0; i < gameState.monsters.length; i++) {
      const m = gameState.monsters[i];
      m.update(battleArea);
    }
    for (let i = gameState.monsters.length - 1; i >= 0; i--) {
      const m = gameState.monsters[i];
      if (m.dead) {
        const completed = this.waveManager.onMonsterKilled();
        gameState.monsters.splice(i, 1);
        if (completed) {
          const type = this.waveManager.getType(gameState.wave);
          const baseGold = 10 * Math.max(1, gameState.wave);
          let mult = 1;
          if (type === 'elite') mult = 3;
          if (type === 'boss') mult = 10;
          gameState.gold += baseGold * mult;
          if (type === 'boss') {
            gameState.tankLimit += 2;
            try { tt.setStorageSync('tankLimit', gameState.tankLimit); } catch (_) {}
          }
          if (this.nextWaveTimer) {
            clearTimeout(this.nextWaveTimer);
            this.nextWaveTimer = null;
          }
          const delay = this.waveManager.getIntervalMs(gameState.wave + 1);
          this.nextWaveTimer = setTimeout(() => {
            const createMonster = (x, y, img, opts) => new Monster(x, y, img, opts);
            this.waveManager.nextWave(gameState, resourceManager, createMonster);
          }, delay);
        }
      }
    }
    const highest = gameState.tanks.reduce((m, t) => Math.max(m, t.level), 0);
    const newScore = gameState.wave * 10 + highest * 5;
    if (newScore !== gameState.score) {
      gameState.score = newScore;
      if (gameState.score > gameState.highestScore) {
        gameState.highestScore = gameState.score;
        try { tt.setStorageSync('highestScore', gameState.highestScore); } catch (_) {}
      }
    }
  },

  initializeBottomButtons() {
    const buttonWidth = 80;
    const buttonHeight = 80;
    const spacing = 15;
    const startX = systemInfo.windowWidth * 0.05;
    const startY = systemInfo.windowHeight * 0.88 - buttonHeight;

    // 按钮1: 宝箱/商店 (橙色)
    gameState.bottomButtons[0] = {
      x: startX,
      y: startY,
      width: buttonWidth,
      height: buttonHeight,
      image: resourceManager.images.bottom_button_01,
      imagePressed: resourceManager.images.bottom_button_01_pressed,
      type: 'shop',
      cost: 0,
      isPressed: false
    };

    // 按钮2: 生成坦克 (紫色，2000金币)
    gameState.bottomButtons[1] = {
      x: startX + (buttonWidth + spacing),
      y: startY,
      width: buttonWidth,
      height: buttonHeight,
      image: resourceManager.images.bottom_button_02,
      imagePressed: resourceManager.images.bottom_button_02_pressed,
      type: 'spawn_tank',
      cost: 2000,
      isPressed: false
    };

    // 按钮3: 升级/强化 (绿色，2300金币)
    gameState.bottomButtons[2] = {
      x: startX + (buttonWidth + spacing) * 2,
      y: startY,
      width: buttonWidth,
      height: buttonHeight,
      image: resourceManager.images.bottom_button_03,
      imagePressed: resourceManager.images.bottom_button_03_pressed,
      type: 'upgrade',
      cost: 2300,
      isPressed: false
    };

    // 按钮4: 饮料/能量 (蓝色)
    gameState.bottomButtons[3] = {
      x: startX + (buttonWidth + spacing) * 3,
      y: startY,
      width: buttonWidth,
      height: buttonHeight,
      image: resourceManager.images.bottom_button_04,
      imagePressed: resourceManager.images.bottom_button_04_pressed,
      type: 'energy',
      cost: 0,
      isPressed: false
    };
  },

  draw() {
    if (!this.isInitialized) {
      this.initialize();
    }

    ctx.clearRect(0, 0, systemInfo.windowWidth, systemInfo.windowHeight);

    // Draw background
    const mainBg = resourceManager.images.mainBg;
    if (mainBg) {
      ctx.drawImage(mainBg, 0, 0, systemInfo.windowWidth, systemInfo.windowHeight);
    }

    ctx.strokeStyle = '#3A7';
    ctx.lineWidth = 2;
    ctx.strokeRect(battleArea.x, battleArea.y, battleArea.width, battleArea.height);
    ctx.strokeStyle = '#A73';
    ctx.strokeRect(mergeArea.x, mergeArea.y, mergeArea.width, mergeArea.height);
    
    // 绘制垃圾桶区域
    this.drawTrashArea();

    gameState.tanks.forEach(tank => tank.draw());
    // TODO: Draw monsters
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`波次: ${gameState.wave}`, 12, 10);
    ctx.fillText(`金币: ${gameState.gold}`, 12, 32);
    ctx.fillText(`积分: ${gameState.score}`, 12, 54);
    ctx.fillText(`历史最高: ${gameState.highestScore}`, 12, 76);

    const btnW = 120;
    const btnH = 40;
    const btnX = systemInfo.windowWidth - btnW - 12;
    const btnY = 12;
    this.resetButton.x = btnX;
    this.resetButton.y = btnY;
    this.resetButton.w = btnW;
    this.resetButton.h = btnH;
    ctx.fillStyle = '#333';
    ctx.fillRect(btnX, btnY, btnW, btnH);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('重新开局', btnX + btnW / 2, btnY + btnH / 2);

    // 绘制底部按钮
    this.drawBottomButtons();
  },

  onTouchStart(touches, switchScene) {
    const t = touches && touches[0];
    if (!t) return;
    const touch = { x: t.clientX, y: t.clientY };
    
    // 检查重置按钮
    if (
      touch.x >= this.resetButton.x &&
      touch.x <= this.resetButton.x + this.resetButton.w &&
      touch.y >= this.resetButton.y &&
      touch.y <= this.resetButton.y + this.resetButton.h
    ) {
      this.reset();
      return;
    }
    
    // 检查底部按钮点击
    for (let i = 0; i < gameState.bottomButtons.length; i++) {
      const button = gameState.bottomButtons[i];
      if (
        touch.x >= button.x &&
        touch.x <= button.x + button.width &&
        touch.y >= button.y &&
        touch.y <= button.y + button.height
      ) {
        // 设置按钮按下状态
        button.isPressed = true;
        this.handleBottomButtonClick(button);
        // 延迟重置按钮状态，创建按下效果
        setTimeout(() => {
          button.isPressed = false;
        }, 100);
        return;
      }
    }
    
    // 检查坦克拖拽
    for (let i = gameState.tanks.length - 1; i >= 0; i--) {
      const tank = gameState.tanks[i];
      if (tank.isTouched(touch)) {
        gameState.dragging = true;
        gameState.dragIndex = i;
        gameState.dragOffsetX = touch.x - tank.x;
        gameState.dragOffsetY = touch.y - tank.y;
        break;
      }
    }
  },

  onTouchMove(touches) {
    if (!gameState.dragging) return;
    const t = touches && touches[0];
    if (!t) return;
    const tank = gameState.tanks[gameState.dragIndex];
    const nx = t.clientX - gameState.dragOffsetX;
    const ny = t.clientY - gameState.dragOffsetY;
    const sx = Math.round(nx / GRID_SIZE) * GRID_SIZE;
    const sy = Math.round(ny / GRID_SIZE) * GRID_SIZE;
    tank.x = sx;
    tank.y = sy;
  },

  onTouchEnd(touches) {
    if (!gameState.dragging) return;
    const idx = gameState.dragIndex;
    const tank = gameState.tanks[idx];
    gameState.dragging = false;
    gameState.dragIndex = -1;

    // 检查是否拖拽到垃圾桶
    const inTrash =
      tank.x >= trashArea.x &&
      tank.x + tank.width <= trashArea.x + trashArea.width &&
      tank.y >= trashArea.y &&
      tank.y + tank.height <= trashArea.y + trashArea.height;

    if (inTrash) {
      // 售卖坦克
      const sellPrice = tank.level * 100; // 每个等级100金币
      gameState.gold += sellPrice;
      gameState.tanks.splice(idx, 1);
      console.log(`售卖了等级${tank.level}的坦克，获得${sellPrice}金币`);
      return;
    }

    const inMerge =
      tank.x >= mergeArea.x &&
      tank.x + tank.width <= mergeArea.x + mergeArea.width &&
      tank.y >= mergeArea.y &&
      tank.y + tank.height <= mergeArea.y + mergeArea.height;

    if (!inMerge) return;

    let pairIndex = -1;
    for (let i = 0; i < gameState.tanks.length; i++) {
      if (i === idx) continue;
      const other = gameState.tanks[i];
      const sameLevel = other.level === tank.level;
      const otherInMerge =
        other.x >= mergeArea.x &&
        other.x + other.width <= mergeArea.x + mergeArea.width &&
        other.y >= mergeArea.y &&
        other.y + other.height <= mergeArea.y + mergeArea.height;
      const near = Math.hypot(other.x - tank.x, other.y - tank.y) <= GRID_SIZE * 1.5;
      if (sameLevel && otherInMerge && near) {
        pairIndex = i;
        break;
      }
    }

    if (pairIndex !== -1) {
      const level = tank.level + 1;
      const imgKey = `tank_level_${Math.min(level, 10)}`;
      const img = resourceManager.images[imgKey];
      const merged = new Tank(level, tank.x, tank.y, img);
      const a = Math.max(idx, pairIndex);
      const b = Math.min(idx, pairIndex);
      gameState.tanks.splice(a, 1);
      gameState.tanks.splice(b, 1);
      if (gameState.tanks.length < gameState.tankLimit) {
        gameState.tanks.push(merged);
      }
      const highest = gameState.tanks.reduce((m, t) => Math.max(m, t.level), 0);
      gameState.score = gameState.wave * 10 + highest * 5;
      if (gameState.score > gameState.highestScore) {
        gameState.highestScore = gameState.score;
        try { tt.setStorageSync('highestScore', gameState.highestScore); } catch (_) {}
      }
    }
  },

  reset() {
    gameState.tanks = [];
    gameState.monsters = [];
    gameState.wave = 0;
    gameState.gold = 0;
    gameState.score = 0;
    const t1 = new Tank(1, 100, 300, resourceManager.images.tank_level_1);
    const t2 = new Tank(1, 200, 300, resourceManager.images.tank_level_1);
    gameState.tanks.push(t1, t2);
    if (this.nextWaveTimer) {
      clearTimeout(this.nextWaveTimer);
      this.nextWaveTimer = null;
    }
    this.waveManager = WaveManager();
    const createMonster = (x, y, img, opts) => new Monster(x, y, img, opts);
    this.waveManager.startFirstWave(gameState, resourceManager, createMonster);
  },
};