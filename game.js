const gameScene = require('./src/scenes/gameScene.js');
const { systemInfo, resourceManager } = require('./src/core/context.js');
const { onTouchStart, onTouchMove, onTouchEnd, raf } = require('./src/adapter/adapter.js');

const sceneManager = {
  scenes: { game: gameScene },
  activeScene: null,
  switchScene(sceneName) {
    if (this.scenes[sceneName]) {
      this.activeScene = this.scenes[sceneName];
      if (typeof this.activeScene.initialize === 'function') {
        this.activeScene.initialize();
      }
    } else {
      console.error(`场景不存在: ${sceneName}`);
    }
  },
  update() {
    if (this.activeScene && typeof this.activeScene.update === 'function') {
      this.activeScene.update();
    }
  },
  draw() {
    if (this.activeScene && typeof this.activeScene.draw === 'function') {
      this.activeScene.draw();
    }
  },
  onTouchStart(touches) {
    if (this.activeScene && typeof this.activeScene.onTouchStart === 'function') {
      this.activeScene.onTouchStart(touches, this.switchScene.bind(this));
    }
  },
  onTouchMove(touches) {
    if (this.activeScene && typeof this.activeScene.onTouchMove === 'function') {
      this.activeScene.onTouchMove(touches);
    }
  },
  onTouchEnd(touches) {
    if (this.activeScene && typeof this.activeScene.onTouchEnd === 'function') {
      this.activeScene.onTouchEnd(touches);
    }
  },
};

onTouchStart(({ touches }) => {
  sceneManager.onTouchStart(touches);
});

onTouchMove(({ touches }) => {
  sceneManager.onTouchMove(touches);
});

onTouchEnd(({ touches }) => {
  sceneManager.onTouchEnd(touches);
});

function gameLoop() {
  sceneManager.update();
  sceneManager.draw();
  raf(gameLoop);
}

resourceManager.load(() => {
  sceneManager.switchScene('game');
  gameLoop();
});
