const { resourceManager } = require('../core/context.js');

class Explosion {
  constructor(x, y, opts = {}) {
    this.x = x;
    this.y = y;
    this.scale = opts.scale || 1;
    this.onComplete = opts.onComplete || (() => {});
    
    this.frameIndex = 0;
    this.frameCount = 6;
    this.animationSpeed = opts.animationSpeed || 0.8;
    this.frameTimer = 0;
    
    this.isComplete = false;
    
    this._loadFrames();
  }
  
  _loadFrames() {
    try {
      this.frames = [];
      for (let i = 0; i < this.frameCount; i++) {
        const frameKey = `explosion_${String(i).padStart(2, '0')}`;
        const texture = resourceManager && resourceManager.textures ? resourceManager.textures[frameKey] : null;
        if (texture) {
          this.frames.push(texture);
        }
      }
      if (this.frames.length === 0) {
        console.warn('No explosion frames loaded, using fallback');
        this.frames = [null];
      }
    } catch (error) {
      console.error('Error loading explosion frames:', error);
      this.frames = [null];
    }
  }
  
  update(deltaTime) {
    if (this.isComplete) return;
    
    this.frameTimer += deltaTime;
    
    if (this.frameTimer >= this.animationSpeed) {
      this.frameTimer = 0;
      this.frameIndex++;
      
      if (this.frameIndex >= this.frames.length) {
        this.isComplete = true;
        this.onComplete();
      }
    }
  }
  
  draw(ctx) {
    if (this.isComplete || this.frames.length === 0) return;
    
    const currentFrame = this.frames[this.frameIndex];
    if (!currentFrame) {
      // Fallback: draw a simple explosion effect if no texture is available
      this.drawFallbackExplosion(ctx);
      return;
    }
    
    try {
      const width = currentFrame.width * this.scale;
      const height = currentFrame.height * this.scale;
      
      ctx.drawImage(
        currentFrame,
        this.x - width / 2,
        this.y - height / 2,
        width,
        height
      );
    } catch (error) {
      console.error('Error drawing explosion frame:', error);
      this.drawFallbackExplosion(ctx);
    }
  }
  
  drawFallbackExplosion(ctx) {
    // Simple fallback explosion effect using canvas drawing
    const size = 30 * this.scale;
    const progress = this.getProgress();
    
    ctx.save();
    ctx.globalAlpha = 1 - progress; // Fade out as animation progresses
    
    // Draw explosion circles
    ctx.fillStyle = '#FF6B35';
    ctx.beginPath();
    ctx.arc(this.x, this.y, size * (0.5 + progress * 0.5), 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFD93D';
    ctx.beginPath();
    ctx.arc(this.x, this.y, size * progress * 0.7, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  getCurrentFrame() {
    return this.frames[this.frameIndex] || null;
  }
  
  getProgress() {
    return this.frames.length > 0 ? this.frameIndex / this.frames.length : 0;
  }
}

module.exports = Explosion;