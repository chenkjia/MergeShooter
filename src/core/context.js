export const systemInfo = tt.getSystemInfoSync();
export const canvas = tt.createCanvas();
export const ctx = canvas.getContext('2d');
const __pr = systemInfo.pixelRatio || 1;
canvas.width = Math.round(systemInfo.windowWidth * __pr);
canvas.height = Math.round(systemInfo.windowHeight * __pr);
ctx.scale(__pr, __pr);

const pr = systemInfo.pixelRatio || 1;
const lsW = systemInfo.screenWidth;
const lsH = systemInfo.screenHeight;
const lwW = systemInfo.windowWidth;
const lwH = systemInfo.windowHeight;
const psW = Math.round(lsW * pr);
const psH = Math.round(lsH * pr);
const pwW = Math.round(lwW * pr);
const pwH = Math.round(lwH * pr);
console.log(`[系统分辨率] 逻辑屏幕: ${lsW}x${lsH}, 物理屏幕: ${psW}x${psH}, 像素比: ${pr}`);
console.log(`[系统分辨率] 逻辑窗口: ${lwW}x${lwH}, 物理窗口: ${pwW}x${pwH}`);

const resources = {
  mainBg: 'src/assets/ui/game_area_bg.png',
  popupBg: 'src/assets/ui/popup_main_bg.png',
  title: 'src/assets/ui/title.png',
  startButton: 'src/assets/ui/start_game_btn.png',
  monster1: 'src/assets/monsters/monster01.png',
  tank_level_1: 'src/assets/tanks/guns/Gun01-Idle_0.png',
  tank_level_2: 'src/assets/tanks/guns/Gun02-Idle_0.png',
  tank_level_3: 'src/assets/tanks/guns/Gun03-Idle_0.png',
  tank_level_4: 'src/assets/tanks/guns/Gun04-Idle_0.png',
  tank_level_5: 'src/assets/tanks/guns/Gun05-Idle_0.png',
  tank_level_6: 'src/assets/tanks/guns/Gun06-Idle_0.png',
  tank_level_7: 'src/assets/tanks/guns/Gun07-Idle_0.png',
  tank_level_8: 'src/assets/tanks/guns/Gun08-Idle_0.png',
  tank_level_9: 'src/assets/tanks/guns/Gun09-Idle_0.png',
  tank_level_10: 'src/assets/tanks/guns/Gun10-Idle_0.png',
  // 底部按钮图片 - 已复制到assets目录
  bottom_button_01: 'src/assets/ui/buttons/btn01.png',
  bottom_button_01_pressed: 'src/assets/ui/buttons/btn01 pressed.png',
  bottom_button_02: 'src/assets/ui/buttons/btn02.png',
  bottom_button_02_pressed: 'src/assets/ui/buttons/btn02 pressed.png',
  bottom_button_03: 'src/assets/ui/buttons/btn03.png',
  bottom_button_03_pressed: 'src/assets/ui/buttons/btn03 pressed.png',
  bottom_button_04: 'src/assets/ui/buttons/btn04.png',
  bottom_button_04_pressed: 'src/assets/ui/buttons/btn04 pressed.png',
  // 垃圾桶图标
  trash_icon: 'src/assets/ui/buttons/bin_icon.png',
  // 商店图标
  store_icon: 'src/assets/ui/buttons/store_icon.png',
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