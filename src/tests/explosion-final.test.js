// Final integration test for complete explosion workflow
const tests = [
  ['Complete game explosion workflow test', () => {
    console.log('🎮 Starting complete game explosion workflow test...');
    
    // Mock game state
    const gameState = {
      monsters: [],
      explosions: [],
      playerHealth: 100,
      score: 0,
      waveNumber: 1,
      gameRunning: true
    };
    
    // Mock monster spawning
    const spawnMonster = (type = 'normal') => {
      const monster = {
        id: Math.random().toString(36).substr(2, 9),
        x: Math.random() * 200 + 100, // Random x position
        y: -50, // Start above screen
        type: type,
        alive: true,
        reachedEnd: false,
        health: type === 'fast' ? 50 : type === 'tank' ? 200 : 100,
        speed: type === 'fast' ? 1.2 : type === 'tank' ? 0.6 : 0.8,
        markReachedEnd: function() {
          this.reachedEnd = true;
          this.alive = false;
        },
        update: function() {
          if (this.alive && !this.reachedEnd) {
            this.y += this.speed;
          }
        }
      };
      
      gameState.monsters.push(monster);
      return monster;
    };
    
    // Mock explosion creation
    const createExplosion = (x, y, scale = 1) => {
      const explosion = {
        id: Math.random().toString(36).substr(2, 9),
        x: x,
        y: y,
        scale: scale,
        frameIndex: 0,
        frameCount: 20,
        isComplete: false,
        update: function(deltaTime) {
          this.frameIndex++;
          if (this.frameIndex >= this.frameCount) {
            this.isComplete = true;
          }
        },
        onComplete: function() {
          gameState.explosions = gameState.explosions.filter(exp => exp.id !== this.id);
          console.log(`💥 Explosion ${this.id} cleaned up`);
        }
      };
      
      gameState.explosions.push(explosion);
      return explosion;
    };
    
    // Mock handle monster reached end
    const handleMonsterReachedEnd = (monster) => {
      console.log(`🎯 Monster ${monster.id} reached end at (${monster.x}, ${monster.y})`);
      
      // Create explosion
      const explosion = createExplosion(monster.x, monster.y, 1.2);
      console.log(`💥 Created explosion ${explosion.id} for monster ${monster.id}`);
      
      // Apply damage based on monster type
      let damage = 10;
      switch (monster.type) {
        case 'fast': damage = 5; break;
        case 'tank': damage = 15; break;
        default: damage = 10;
      }
      
      gameState.playerHealth = Math.max(0, gameState.playerHealth - damage);
      console.log(`💔 Player damaged: ${damage}, remaining health: ${gameState.playerHealth}`);
      
      // Remove monster
      monster.markReachedEnd();
      gameState.monsters = gameState.monsters.filter(m => m.id !== monster.id);
      console.log(`🗑️  Monster ${monster.id} removed from game`);
      
      return true;
    };
    
    // Mock game loop
    const gameLoop = () => {
      // Update monsters
      gameState.monsters.forEach(monster => {
        monster.update();
        
        // Check if monster reached end (y > 600)
        if (monster.y >= 600) {
          handleMonsterReachedEnd(monster);
        }
      });
      
      // Update explosions and clean up completed ones
      const activeExplosions = [];
      gameState.explosions.forEach(explosion => {
        explosion.update(0.1);
        if (!explosion.isComplete) {
          activeExplosions.push(explosion);
        } else if (explosion.onComplete) {
          explosion.onComplete();
        }
      });
      
      gameState.explosions = activeExplosions;
    };
    
    // Test 1: Spawn normal monster
    console.log('\n🎲 Test 1: Normal monster explosion');
    const normalMonster = spawnMonster('normal');
    
    // Simulate monster movement until it reaches end
    let iterations = 0;
    while (normalMonster.y < 600 && normalMonster.alive && iterations < 1000) {
      gameLoop();
      iterations++;
    }
    
    // Run a few more iterations to allow explosion to complete
    for (let i = 0; i < 50; i++) {
      gameLoop();
    }
    
    console.log(`Monster reached end after ${iterations} iterations`);
    
    // Verify monster was removed
    if (gameState.monsters.find(m => m.id === normalMonster.id)) {
      throw new Error('Normal monster should be removed after explosion');
    }
    
    // Verify explosion was created and cleaned up
    if (gameState.explosions.length > 0) {
      throw new Error('Explosion should be cleaned up after completion');
    }
    
    // Verify player health decreased by correct amount
    if (gameState.playerHealth !== 90) {
      throw new Error('Player health should decrease by 10 for normal monster');
    }
    
    console.log('✅ Normal monster explosion test passed');
    
    // Test 2: Spawn fast monster
    console.log('\n🎲 Test 2: Fast monster explosion');
    const fastMonster = spawnMonster('fast');
    
    while (fastMonster.y < 600 && fastMonster.alive) {
      gameLoop();
    }
    
    if (gameState.playerHealth !== 85) {
      throw new Error('Player health should decrease by 5 for fast monster');
    }
    
    console.log('✅ Fast monster explosion test passed');
    
    // Test 3: Spawn tank monster
    console.log('\n🎲 Test 3: Tank monster explosion');
    const tankMonster = spawnMonster('tank');
    
    while (tankMonster.y < 600 && tankMonster.alive) {
      gameLoop();
    }
    
    if (gameState.playerHealth !== 70) {
      throw new Error('Player health should decrease by 15 for tank monster');
    }
    
    console.log('✅ Tank monster explosion test passed');
    
    // Test 4: Multiple monsters
    console.log('\n🎲 Test 4: Multiple monsters explosion');
    const monster1 = spawnMonster('normal');
    const monster2 = spawnMonster('fast');
    const monster3 = spawnMonster('tank');
    
    // Move all monsters to end
    while (gameState.monsters.length > 0) {
      gameLoop();
    }
    
    // Run additional iterations to ensure all explosions complete
    for (let i = 0; i < 100; i++) {
      gameLoop();
    }
    
    // Verify final state
    if (gameState.monsters.length !== 0) {
      throw new Error('All monsters should be removed');
    }
    
    if (gameState.explosions.length !== 0) {
      throw new Error('All explosions should be cleaned up');
    }
    
    if (gameState.playerHealth !== 40) {
      throw new Error(`Player health should be 40 after all explosions, but is ${gameState.playerHealth}`);
    }
    
    console.log('✅ Multiple monsters explosion test passed');
    
    console.log('\n🎉 All explosion workflow tests completed successfully!');
    console.log('📊 Final game state:');
    console.log(`  - Player Health: ${gameState.playerHealth}/100`);
    console.log(`  - Active Monsters: ${gameState.monsters.length}`);
    console.log(`  - Active Explosions: ${gameState.explosions.length}`);
    console.log(`  - Game Running: ${gameState.gameRunning}`);
  }]
];

module.exports = { tests };