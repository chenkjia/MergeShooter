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
  monster1: 'src/assets/monsters/monster01.png',
  tank_level_1: 'doc/Guns/Gun01/Idle/Gun01-Idle_0.png',
  tank_level_2: 'doc/Guns/Gun02/Idle/Gun02-Idle_0.png',
  tank_level_3: 'doc/Guns/Gun03/Idle/Gun03-Idle_0.png',
  tank_level_4: 'doc/Guns/Gun04/Idle/Gun04-Idle_0.png',
  tank_level_5: 'doc/Guns/Gun05/Idle/Gun05-Idle_0.png',
  tank_level_6: 'doc/Guns/Gun06/Idle/Gun06-Idle_0.png',
  tank_level_7: 'doc/Guns/Gun07/Idle/Gun07-Idle_0.png',
  tank_level_8: 'doc/Guns/Gun08/Idle/Gun08-Idle_0.png',
  tank_level_9: 'doc/Guns/Gun09/Idle/Gun09-Idle_0.png',
  tank_level_10: 'doc/Guns/Gun10/Idle/Gun10-Idle_0.png',
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