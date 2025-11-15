import { startScene } from './src/scenes/startScene.js';
import { gameScene } from './src/scenes/gameScene.js';
import { systemInfo, canvas, ctx, resourceManager } from './src/core/context.js';

const sceneManager = {
  scenes: {
    start: startScene,
    game: gameScene,
  },
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

tt.onTouchStart(({ touches }) => {
  sceneManager.onTouchStart(touches);
});

tt.onTouchMove(({ touches }) => {
  sceneManager.onTouchMove(touches);
});

tt.onTouchEnd(({ touches }) => {
  sceneManager.onTouchEnd(touches);
});

function gameLoop() {
  sceneManager.update();
  sceneManager.draw();
  requestAnimationFrame(gameLoop);
}

resourceManager.load(() => {
  sceneManager.switchScene('start');
  gameLoop();
});