const { ctx } = require('../core/context.js');
const { styles } = require('../core/styles.js');
const PathMonster = require('../entities/pathMonster.js');

/**
 * 怪物路径区域类
 * 负责管理6条竖向怪物路径的绘制和交互，对应6列炮塔
 */
class MonsterPathArea {
  constructor(bounds) {
    // 区域边界
    this.bounds = bounds;
    
    // 路径配置 - 6条竖向路径对应6列炮塔
    this.pathCount = styles.turret.cols; // 6条怪物路径
    this.pathWidth = 0;
    this.pathSpacing = 0;
    this.paths = []; // 存储每条路径的信息
    
    // 路径样式
    this.pathColor = '#5a98c4';
    this.pathBorderColor = '#4a88b4';
    this.pathBorderWidth = 2;
    
    // 怪物相关
    this.monsters = []; // 存储路径上的怪物
    this.allMonsters = []; // 存储所有怪物，便于统一管理
    
    // 生成控制 - 调整生成频率，让怪物出现得更慢
    this.spawnTimer = 0;
    this.baseSpawnInterval = 3000; // 基础间隔：3秒（原1秒）
    this.spawnInterval = this.baseSpawnInterval;
    this.lastSpawnTime = 0;
    this.monsterCounter = 0; // 怪物计数器
    
    // 生成随机化
    this.spawnRandomization = 0.3; // 30%的随机化范围
    this.nextSpawnDelay = this.calculateNextSpawnDelay();
    
    // 波次控制
    this.waveNumber = 1;
    this.monstersInWave = 5; // 每波5个怪物
    this.monstersSpawnedInWave = 0;
    this.waveCooldown = 5000; // 波次间隔：5秒
    this.waveStartTime = Date.now();
    this.isWaveActive = true;
    
    // 玩家生命值（用于爆炸完成时结算伤害）
    this.maxPlayerHealth = 100;
    this.playerHealth = this.maxPlayerHealth;
    
    // 爆炸效果管理
    this.explosions = [];
    this.lastUpdateTime = Date.now();
    
    this.initializePaths();
  }

  /**
   * 初始化路径配置 - 竖向路径，对应炮塔列
   */
  initializePaths() {
    // 计算每条路径的宽度和间距，与炮塔网格对齐
    const cellSize = styles.turret.outerSize;
    const spacing = styles.turret.spacing;
    const totalWidth = this.pathCount * cellSize + (this.pathCount - 1) * spacing;
    
    // 居中计算
    const startX = this.bounds.x + Math.floor((this.bounds.width - totalWidth) / 2);
    
    // 生成每条路径的信息
    this.paths = [];
    for (let i = 0; i < this.pathCount; i++) {
      const x = startX + i * (cellSize + spacing);
      this.paths.push({
        index: i,
        x: x,
        y: this.bounds.y,
        width: cellSize,
        height: this.bounds.height,
        centerX: x + cellSize / 2, // 路径中心线X坐标
        monsters: [] // 该路径上的怪物
      });
    }
  }

  initialize() {
    // 初始化怪物路径区域
    console.log('怪物路径区域已初始化，包含6条竖向路径');
    console.log('路径配置:', {
      pathCount: this.pathCount,
      cellSize: styles.turret.outerSize,
      spacing: styles.turret.spacing,
      bounds: this.bounds
    });
    console.log('各路径位置:', this.paths.map(p => ({
      index: p.index,
      x: p.x,
      centerX: p.centerX,
      width: p.width
    })));
    
    // 启动怪物生成
    this.lastSpawnTime = Date.now();
    this.nextSpawnDelay = this.calculateNextSpawnDelay();
    console.log(`怪物生成系统已启动，基础间隔${this.baseSpawnInterval/1000}秒，随机化±${this.spawnRandomization*100}%`);
    console.log(`波次系统：每波${this.monstersInWave}个怪物，波次间隔${this.waveCooldown/1000}秒`);
  }

  /**
   * 绘制怪物路径区域
   */
  draw() {
    if (!ctx) return;
    
    // 绘制背景
    ctx.fillStyle = this.pathColor;
    ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
    
    // 绘制每条竖向路径的边框
    ctx.strokeStyle = this.pathBorderColor;
    ctx.lineWidth = this.pathBorderWidth;
    
    this.paths.forEach(path => {
      ctx.strokeRect(path.x, path.y, path.width, path.height);
      
      // 绘制路径中心竖线（用于调试和视觉效果）
      ctx.beginPath();
      ctx.moveTo(path.centerX, path.y);
      ctx.lineTo(path.centerX, path.y + path.height);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]); // 重置虚线
      ctx.strokeStyle = this.pathBorderColor; // 恢复边框颜色
      ctx.lineWidth = this.pathBorderWidth;
    });
    
    // 绘制路径上的怪物
    this.drawMonsters();
    
    // 绘制爆炸动画
    this.drawExplosions();
  }

  /**
   * 绘制怪物
   */
  drawMonsters() {
    // 绘制所有存活的怪物
    this.allMonsters.forEach(monster => {
      if (monster.isAlive()) {
        monster.draw();
      }
    });
  }

  /**
   * 绘制爆炸动画
   */
  drawExplosions() {
    if (!ctx) return;
    this.explosions.forEach(exp => {
      try {
        exp.draw(ctx);
      } catch (e) {
        // 忽略绘制错误以保证流畅性
      }
    });
  }

  /**
   * 计算下一次生成延迟（带随机化）
   */
  calculateNextSpawnDelay() {
    const randomFactor = 1 + (Math.random() - 0.5) * this.spawnRandomization * 2;
    return Math.round(this.baseSpawnInterval * randomFactor);
  }

  /**
   * 检查波次状态并更新
   */
  checkWaveStatus() {
    const currentTime = Date.now();
    
    if (this.isWaveActive) {
      // 当前波次进行中
      if (this.monstersSpawnedInWave >= this.monstersInWave) {
        // 当前波次完成，进入冷却
        this.isWaveActive = false;
        this.waveStartTime = currentTime;
        console.log(`第${this.waveNumber}波怪物生成完成，进入${this.waveCooldown/1000}秒冷却`);
      }
    } else {
      // 波次冷却中
      if (currentTime - this.waveStartTime >= this.waveCooldown) {
        // 冷却结束，开始新波次
        this.waveNumber++;
        this.monstersSpawnedInWave = 0;
        this.isWaveActive = true;
        this.waveStartTime = currentTime;
        console.log(`开始第${this.waveNumber}波怪物生成`);
      }
    }
  }

  /**
   * 更新怪物路径状态
   */
  update(deltaTime) {
    const currentTime = Date.now();
    const dtSec = (currentTime - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = currentTime;
    
    // 检查波次状态
    this.checkWaveStatus();
    
    // 只有在活跃波次中才生成怪物
    if (this.isWaveActive && (currentTime - this.lastSpawnTime >= this.nextSpawnDelay)) {
      if (this.monstersSpawnedInWave < this.monstersInWave) {
        this.spawnMonster();
        this.monstersSpawnedInWave++;
        this.lastSpawnTime = currentTime;
        this.nextSpawnDelay = this.calculateNextSpawnDelay(); // 计算下一次延迟
      }
    }
    
    // 更新所有怪物位置与射击区接触检测
    const nextMonsters = [];
    for (let i = 0; i < this.allMonsters.length; i++) {
      const monster = this.allMonsters[i];
      if (monster.isAlive() && !monster.reachedEnd) {
        monster.update();
        // 精确检测怪物是否接触射击台边界
        if (this.checkMonsterReachedShootingArea(monster)) {
          if (!monster.exploded) {
            monster.exploded = true;
            // 触发爆炸：立即清除怪物对象
            monster.reachedEnd = true;
            monster.alive = false;
            const dmg = this.getDamageByMonsterType(monster.type);
            this.createExplosion(monster.x, monster.y, {
              scale: 0.5,
              animationSpeed: 0.08,
              damageOnComplete: dmg
            });
          }
        } else {
          nextMonsters.push(monster);
        }
      }
    }
    this.allMonsters = nextMonsters;

    // 更新并清理爆炸动画对象
    this.updateExplosions(dtSec > 0 ? dtSec : 0.016);
  }

  /**
   * 生成怪物
   */
  spawnMonster() {
    // 随机选择一条路径
    const pathIndex = Math.floor(Math.random() * this.pathCount);
    const path = this.paths[pathIndex];
    
    // 在路径顶部生成怪物
    const monsterX = path.centerX;
    const monsterY = path.y - 30; // 从区域外开始
    
    // 随机怪物类型
    const types = ['normal', 'fast', 'tank'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // 根据类型设置属性
    let monsterData = {
      x: monsterX,
      y: monsterY,
      pathIndex: pathIndex,
      type: type
    };
    
    switch (type) {
      case 'fast':
        monsterData.speed = 1.2; // 降低速度：原3.0改为1.2
        monsterData.health = 50;
        monsterData.attack = 5;
        break;
      case 'tank':
        monsterData.speed = 0.6; // 降低速度：原1.0改为0.6
        monsterData.health = 200;
        monsterData.attack = 15;
        break;
      default: // normal
        monsterData.speed = 0.8; // 降低速度：原2.0改为0.8
        monsterData.health = 100;
        monsterData.attack = 10;
    }
    
    const monster = new PathMonster(monsterX, monsterY, pathIndex, monsterData);
    this.allMonsters.push(monster);
    this.monsterCounter++;
    
    console.log(`生成怪物 #${this.monsterCounter}: 类型=${type}, 路径=${pathIndex}, 位置=(${monsterX}, ${monsterY}), 速度=${monsterData.speed} [第${this.waveNumber}波 ${this.monstersSpawnedInWave+1}/${this.monstersInWave}]`);
  }

  /**
   * 怪物是否接触到射击台（使用精确AABB下边界判定）
   */
  checkMonsterReachedShootingArea(monster) {
    const monsterBottom = monster.y + (monster.height || 0) / 2;
    const boundaryTop = this.bounds.y + this.bounds.height;
    const threshold = 10; // 容差，提高判定稳定性
    return monsterBottom >= boundaryTop - threshold;
  }

  /**
   * 根据怪物类型获取伤害值
   */
  getDamageByMonsterType(type) {
    switch (type) {
      case 'fast': return 5;
      case 'tank': return 15;
      default: return 10;
    }
  }

  /**
   * 造成玩家伤害（在爆炸动画播放完毕时触发）
   */
  damagePlayer(amount) {
    const dmg = Math.max(0, amount || 0);
    this.playerHealth = Math.max(0, this.playerHealth - dmg);
    return this.playerHealth;
  }

  /**
   * 创建爆炸效果
   */
  createExplosion(x, y, opts = {}) {
    const Explosion = require('../entities/explosion.js');
    const scale = opts.scale || 0.5;
    const speed = opts.animationSpeed || 0.08;
    const dmg = opts.damageOnComplete || 0;
    const exp = new Explosion(x, y, {
      scale,
      animationSpeed: speed,
      onComplete: () => {
        try {
          this.damagePlayer(dmg);
        } finally {
          // 动画完成后移除自身
          this.explosions = this.explosions.filter(e => e !== exp);
        }
      }
    });
    this.explosions.push(exp);
    return exp;
  }

  /**
   * 更新爆炸动画并进行内存清理
   */
  updateExplosions(deltaTimeSec) {
    const active = [];
    for (let i = 0; i < this.explosions.length; i++) {
      const exp = this.explosions[i];
      try {
        exp.update(deltaTimeSec);
        if (!exp.isComplete) active.push(exp);
      } catch (e) {
        // 出错时直接丢弃，保证游戏流畅
      }
    }
    this.explosions = active;
  }

  /**
   * 处理触摸开始事件
   */
  onTouchStart(touches) {
    // TODO: 实现触摸交互逻辑
    // 可以用于选择路径、放置防御塔等
  }

  /**
   * 处理触摸移动事件
   */
  onTouchMove(touches) {
    // TODO: 实现触摸移动逻辑
  }

  /**
   * 处理触摸结束事件
   */
  onTouchEnd(touches) {
    // TODO: 实现触摸结束逻辑
  }

  /**
   * 获取指定坐标所在的路径
   */
  getPathAt(x, y) {
    return this.paths.find(path => 
      x >= path.x && x <= path.x + path.width &&
      y >= path.y && y <= path.y + path.height
    );
  }

  /**
   * 根据X坐标获取最近的路径（用于怪物对齐到路径）
   */
  getNearestPath(x) {
    let nearestPath = this.paths[0];
    let minDistance = Math.abs(x - this.paths[0].centerX);
    
    for (let i = 1; i < this.paths.length; i++) {
      const distance = Math.abs(x - this.paths[i].centerX);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPath = this.paths[i];
      }
    }
    
    return nearestPath;
  }

  /**
   * 在指定路径添加怪物
   */
  addMonster(pathIndex, monsterData) {
    if (pathIndex >= 0 && pathIndex < this.pathCount) {
      // 确保怪物在路径中心
      const path = this.paths[pathIndex];
      monsterData.x = path.centerX;
      monsterData.pathIndex = pathIndex;
      this.paths[pathIndex].monsters.push(monsterData);
    }
  }

  /**
   * 在指定X坐标位置添加怪物（自动对齐到最近路径）
   */
  addMonsterAtX(x, monsterData) {
    const nearestPath = this.getNearestPath(x);
    if (nearestPath) {
      this.addMonster(nearestPath.index, monsterData);
    }
  }

  /**
   * 获取所有路径信息
   */
  getPaths() {
    return this.paths;
  }

  /**
   * 获取区域边界
   */
  getBounds() {
    return this.bounds;
  }
}

module.exports = MonsterPathArea;