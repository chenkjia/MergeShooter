// Simple explosion cleanup test
console.log('🧪 Testing explosion cleanup logic...');

// Mock game state
let gameState = {
  explosions: []
};

// Create explosion
const createExplosion = (x, y) => {
  const explosion = {
    id: 'test-explosion-1',
    x: x,
    y: y,
    frameIndex: 0,
    frameCount: 20,
    isComplete: false,
    update: function(deltaTime) {
      this.frameIndex++;
      if (this.frameIndex >= this.frameCount) {
        this.isComplete = true;
      }
    }
  };
  
  // Set up cleanup
  explosion.onComplete = function() {
    console.log(`Cleaning up explosion ${this.id}`);
    gameState.explosions = gameState.explosions.filter(exp => exp.id !== this.id);
  };
  
  gameState.explosions.push(explosion);
  return explosion;
};

// Test explosion lifecycle
const explosion = createExplosion(100, 200);
console.log(`Created explosion, active explosions: ${gameState.explosions.length}`);

// Simulate animation
while (!explosion.isComplete) {
  explosion.update(0.1);
}

console.log(`Explosion completed, active explosions: ${gameState.explosions.length}`);

// Trigger cleanup
if (explosion.isComplete && explosion.onComplete) {
  explosion.onComplete();
}

console.log(`After cleanup, active explosions: ${gameState.explosions.length}`);

if (gameState.explosions.length === 0) {
  console.log('✅ Explosion cleanup works correctly!');
} else {
  console.log('❌ Explosion cleanup failed');
  process.exit(1);
}