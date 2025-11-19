const { ctx, resourceManager } = require('../core/context.js');

/**
 * 路径怪物类 - 专门用于竖向路径移动，支持精灵图动画
 */
class PathMonster {
  constructor(x, y, pathIndex, opts = {}) {
    this.x = x;
    this.y = y;
    this.pathIndex = pathIndex;
    this.width = 50;  // 调整为适合精灵图的尺寸
    this.height = 50;
    
    // 怪物属性 - 调整速度让怪物走得更慢
    this.speed = opts.speed || 0.8; // 降低速度：原2.0改为0.8
    this.health = opts.health || 100;
    this.maxHealth = this.health;
    this.attack = opts.attack || 10;
    this.type = opts.type || 'normal';
    
    // 状态
    this.alive = true;
    this.reachedEnd = false;
    
    // 动画相关
    this.animationTime = 0;
    this.animationSpeed = 0.08; // 动画播放速度
    this.currentFrame = 0;
    this.totalFrames = 20; // 每类怪物有20帧动画
    this.animationDuration = 1000; // 完整动画周期（毫秒）
    
    // 精灵图资源
    this.animationFrames = this.loadAnimationFrames();
  }

  /**
   * 根据怪物类型加载对应的动画帧
   */
  loadAnimationFrames() {
    const frames = [];
    const monsterTypeMap = {
      'normal': 'monster01',
      'fast': 'monster02', 
      'tank': 'monster03'
    };
    
    const baseName = monsterTypeMap[this.type] || 'monster01';
    
    // 加载所有动画帧
    for (let i = 0; i < this.totalFrames; i++) {
      const frameKey = `${baseName}_${i.toString().padStart(2, '0')}`;
      if (resourceManager.textures[frameKey]) {
        frames.push(resourceManager.textures[frameKey]);
      }
    }
    
    // 如果没有找到精灵图，使用备用方案
    if (frames.length === 0) {
      console.warn(`未找到${this.type}类型的精灵图，使用彩色方块代替`);
      this.useFallbackRendering = true;
    }
    
    return frames;
  }

  /**
   * 根据怪物类型获取颜色
   */
  getColorByType() {
    switch (this.type) {
      case 'fast':
        return '#ff6b35'; // 橙色 - 快速
      case 'tank':
        return '#4ecdc4'; // 青色 - 坦克
      case 'boss':
        return '#8b5cf6'; // 紫色 - Boss
      default:
        return '#ff4444'; // 红色 - 普通
    }
  }

  /**
   * 绘制怪物
   */
  draw() {
    if (!ctx || !this.alive) return;
    
    // 更新动画帧
    this.updateAnimation();
    
    // 绘制怪物主体
    if (this.useFallbackRendering) {
      // 备用渲染：彩色方块
      ctx.fillStyle = this.getColorByType();
      ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
      
      // 绘制边框
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
    } else {
      // 精灵图渲染
      const currentFrameImage = this.animationFrames[this.currentFrame];
      if (currentFrameImage && currentFrameImage.width && currentFrameImage.height) {
        ctx.drawImage(
          currentFrameImage, 
          this.x - this.width/2, 
          this.y - this.height/2, 
          this.width, 
          this.height
        );
      } else {
        // 如果精灵图加载失败，使用备用渲染
        this.useFallbackRendering = true;
        this.draw(); // 重新绘制
        return;
      }
    }
    
    // 绘制血条
    this.drawHealthBar();
    
    // 绘制类型标识（仅备用渲染时显示）
    if (this.type !== 'normal' && this.useFallbackRendering) {
      this.drawTypeIndicator();
    }
  }

  /**
   * 更新动画帧
   */
  updateAnimation() {
    if (this.animationFrames.length === 0) return;
    
    this.animationTime += this.animationSpeed;
    if (this.animationTime >= 1) {
      this.animationTime = 0;
      this.currentFrame = (this.currentFrame + 1) % this.animationFrames.length;
    }
  }

  /**
   * 绘制血条
   */
  drawHealthBar() {
    const barWidth = this.width;
    const barHeight = 4;
    const barY = this.y - this.height/2 - barHeight - 2;
    
    // 血条背景
    ctx.fillStyle = '#333333';
    ctx.fillRect(this.x - barWidth/2, barY, barWidth, barHeight);
    
    // 当前血量
    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = healthPercent > 0.5 ? '#44ff44' : healthPercent > 0.25 ? '#ffff44' : '#ff4444';
    ctx.fillRect(this.x - barWidth/2, barY, barWidth * healthPercent, barHeight);
  }

  /**
   * 绘制类型标识
   */
  drawTypeIndicator() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.type.charAt(0).toUpperCase(), this.x, this.y + 4);
  }

  /**
   * 更新怪物位置（沿路径向下移动）
   */
  update() {
    if (!this.alive || this.reachedEnd) return;
    
    // 沿路径向下移动（向炮台方向）- 降低移动速度
    this.y += this.speed;
  }

  /**
   * 受到伤害
   */
  takeDamage(damage) {
    if (!this.alive) return;
    
    this.health -= damage;
    if (this.health <= 0) {
      this.alive = false;
      console.log(`怪物在路径${this.pathIndex}被消灭！`);
    }
  }

  /**
   * 检查是否存活
   */
  isAlive() {
    return this.alive;
  }

  /**
   * 获取怪物中心点
   */
  getCenter() {
    return {
      x: this.x,
      y: this.y
    };
  }

  /**
   * 获取碰撞矩形
   */
  getBounds() {
    return {
      x: this.x - this.width/2,
      y: this.y - this.height/2,
      width: this.width,
      height: this.height
    };
  }
}

module.exports = PathMonster;