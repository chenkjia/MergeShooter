import { startScene } from './src/scenes/startScene.js';
import { gameScene } from './src/scenes/gameScene.js';

export const systemInfo = tt.getSystemInfoSync();
export const canvas = tt.createCanvas();
export const ctx = canvas.getContext('2d');
canvas.width = systemInfo.windowWidth;
canvas.height = systemInfo.windowHeight;

const resources = {
  mainBg: 'src/assets/ui/game_area_bg.png',
  popupBg: 'src/assets/ui/popup_main_bg.png',
  title: 'src/assets/ui/title.png',
  startButton: 'src/assets/ui/start_game_btn.png',
};

export const resourceManager = {
  images: {},
  load(callback) {
    const imagePaths = Object.values(resources);
    const imageKeys = Object.keys(resources);
    let loadedCount = 0;

    if (imagePaths.length === 0) {
      callback();
      return;
    }

    imagePaths.forEach((path, index) => {
      const key = imageKeys[index];
      const image = tt.createImage();
      image.src = path;
      image.onload = () => {
        this.images[key] = image;
        loadedCount++;
        if (loadedCount === imagePaths.length) {
          callback();
        }
      };
      image.onerror = (err) => {
        console.error(`图片加载失败: ${path}`, err);
      };
    });
  }
};

const sceneManager = {
  scenes: {
    start: startScene,
    game: gameScene,
  },
  activeScene: null,
  switchScene(sceneName) {
    if (this.scenes[sceneName]) {
      this.activeScene = this.scenes[sceneName];
    } else {
      console.error(`场景不存在: ${sceneName}`);
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
};

tt.onTouchStart(({ touches }) => {
  sceneManager.onTouchStart(touches);
});

function gameLoop() {
  sceneManager.draw();
  requestAnimationFrame(gameLoop);
}

resourceManager.load(() => {
  sceneManager.switchScene('start');
  gameLoop();
});