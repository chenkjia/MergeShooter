// Mock context and resource manager for testing
const mockCtx = {
  drawImage: () => {},
  fillRect: () => {},
  strokeRect: () => {},
  fillText: () => {},
  measureText: () => ({ width: 100 })
};

const mockResourceManager = {
  textures: {
    explosion_00: { width: 64, height: 64 },
    explosion_01: { width: 64, height: 64 },
    explosion_02: { width: 64, height: 64 }
  }
};

const mockGetCtx = () => ({
  ctx: mockCtx,
  resourceManager: mockResourceManager
});

// Mock the context module before requiring the classes
const mockContext = {
  getCtx: mockGetCtx,
  ctx: mockCtx,
  resourceManager: mockResourceManager
};

// Create a simple mock for the context module
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(id) {
  if (id === '../core/context.js') {
    return mockContext;
  }
  return originalRequire.apply(this, arguments);
};

const Explosion = require('../entities/explosion.js');
const MonsterPathArea = require('../areas/MonsterPathArea.js');
const PathMonster = require('../entities/pathMonster.js');

const tests = [
  ['Explosion class should initialize correctly', () => {
    const explosion = new Explosion(100, 200);
    if (explosion.x !== 100) throw new Error('X coordinate not set correctly');
    if (explosion.y !== 200) throw new Error('Y coordinate not set correctly');
    if (explosion.frameIndex !== 0) throw new Error('Frame index should start at 0');
    if (explosion.isComplete !== false) throw new Error('Explosion should not be complete initially');
  }],
  
  ['Explosion should update frame index', () => {
    const explosion = new Explosion(100, 200);
    const initialFrame = explosion.frameIndex;
    explosion.update(1.0); // Large delta time to trigger frame change
    if (explosion.frameIndex <= initialFrame) throw new Error('Frame index should increase');
  }],
  
  ['Explosion should complete after all frames', () => {
    const explosion = new Explosion(100, 200);
    // Simulate updating through all frames
    for (let i = 0; i < 25; i++) {
      explosion.update(1.0);
    }
    if (!explosion.isComplete) throw new Error('Explosion should be complete after all frames');
  }],
  
  ['MonsterPathArea should handle player damage correctly', () => {
    const bounds = { x: 0, y: 0, width: 400, height: 600 };
    const pathArea = new MonsterPathArea(bounds);
    
    const initialHealth = pathArea.playerHealth;
    const damage = 10;
    const remainingHealth = pathArea.damagePlayer(damage);
    
    if (remainingHealth !== initialHealth - damage) throw new Error('Health not reduced correctly');
    if (pathArea.playerHealth !== initialHealth - damage) throw new Error('Player health not updated correctly');
  }],
  
  ['MonsterPathArea should create explosions', () => {
    const bounds = { x: 0, y: 0, width: 400, height: 600 };
    const pathArea = new MonsterPathArea(bounds);
    const initialExplosionCount = pathArea.explosions.length;
    
    pathArea.createExplosion(100, 200);
    
    if (pathArea.explosions.length !== initialExplosionCount + 1) throw new Error('Explosion not created');
  }],
  
  ['MonsterPathArea should detect shooting area boundary correctly', () => {
    const bounds = { x: 0, y: 0, width: 400, height: 600 };
    const pathArea = new MonsterPathArea(bounds);
    
    // Create a mock monster near the boundary
    const mockMonster = {
      x: 200,
      y: 590, // Near the bottom boundary
      isAlive: () => true,
      reachedEnd: false
    };
    
    const reachedBoundary = pathArea.checkMonsterReachedShootingArea(mockMonster);
    if (!reachedBoundary) throw new Error('Should detect boundary reach');
  }]
];

module.exports = { tests };