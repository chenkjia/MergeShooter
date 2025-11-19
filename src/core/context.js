import { getSystemInfoSync, createCanvas, createImage, mountCanvas } from '../adapter/adapter.js';
export const systemInfo = getSystemInfoSync();
export const canvas = createCanvas();
const __pr = systemInfo.pixelRatio || 1;
canvas.width = Math.round(systemInfo.windowWidth * __pr);
canvas.height = Math.round(systemInfo.windowHeight * __pr);
export const ctx = canvas.getContext ? canvas.getContext('2d') : null;
if (ctx && __pr && __pr !== 1) { ctx.scale(__pr, __pr); }
mountCanvas(canvas, systemInfo.windowWidth, systemInfo.windowHeight);

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
  tank_level_11: 'src/assets/tanks/guns/Gun11-Idle_0.png',
  tank_level_12: 'src/assets/tanks/guns/Gun12-Idle_0.png',
  tank_level_13: 'src/assets/tanks/guns/Gun13-Idle_0.png',
  tank_level_14: 'src/assets/tanks/guns/Gun14-Idle_0.png',
  tank_level_15: 'src/assets/tanks/guns/Gun15-Idle_0.png',
  tank_level_16: 'src/assets/tanks/guns/Gun16-Idle_0.png',
  tank_level_17: 'src/assets/tanks/guns/Gun17-Idle_0.png',
  tank_level_18: 'src/assets/tanks/guns/Gun18-Idle_0.png',
  tank_level_19: 'src/assets/tanks/guns/Gun19-Idle_0.png',
  tank_level_20: 'src/assets/tanks/guns/Gun20-Idle_0.png',
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
  money_bar: 'src/assets/ui/money_bar.png',
  shield_icon: 'src/assets/ui/buttons/shield_icon.png',
  tank_icon: 'src/assets/ui/buttons/tank_icon.png',
  
  // 爆炸动画资源（Dead FX），统一管理于 assets 目录
  explosion_00: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_00.png',
  explosion_01: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_01.png',
  explosion_02: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_02.png',
  explosion_03: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_03.png',
  explosion_04: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_04.png',
  explosion_05: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_05.png',
  explosion_06: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_06.png',
  explosion_07: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_07.png',
  explosion_08: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_08.png',
  explosion_09: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_09.png',
  explosion_10: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_10.png',
  explosion_11: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_11.png',
  explosion_12: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_12.png',
  explosion_13: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_13.png',
  explosion_14: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_14.png',
  explosion_15: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_15.png',
  explosion_16: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_16.png',
  explosion_17: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_17.png',
  explosion_18: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_18.png',
  explosion_19: 'src/assets/explosions/EnemyDieFx-EnemyDieFx_19.png',

  bullet_1: 'src/assets/bullets/1.png',
  bullet_2: 'src/assets/bullets/2.png',
  bullet_3: 'src/assets/bullets/3.png',
  bullet_4: 'src/assets/bullets/4.png',
  bullet_5: 'src/assets/bullets/5.png',
  bullet_6: 'src/assets/bullets/6.png',
  bullet_7: 'src/assets/bullets/7.png',
  bullet_8: 'src/assets/bullets/8.png',
  
  // 怪物精灵图资源
  monster01_00: 'src/assets/monsters/animations/Monster01/Monster01-animation_00.png',
  monster01_01: 'src/assets/monsters/animations/Monster01/Monster01-animation_01.png',
  monster01_02: 'src/assets/monsters/animations/Monster01/Monster01-animation_02.png',
  monster01_03: 'src/assets/monsters/animations/Monster01/Monster01-animation_03.png',
  monster01_04: 'src/assets/monsters/animations/Monster01/Monster01-animation_04.png',
  monster01_05: 'src/assets/monsters/animations/Monster01/Monster01-animation_05.png',
  monster01_06: 'src/assets/monsters/animations/Monster01/Monster01-animation_06.png',
  monster01_07: 'src/assets/monsters/animations/Monster01/Monster01-animation_07.png',
  monster01_08: 'src/assets/monsters/animations/Monster01/Monster01-animation_08.png',
  monster01_09: 'src/assets/monsters/animations/Monster01/Monster01-animation_09.png',
  monster01_10: 'src/assets/monsters/animations/Monster01/Monster01-animation_10.png',
  monster01_11: 'src/assets/monsters/animations/Monster01/Monster01-animation_11.png',
  monster01_12: 'src/assets/monsters/animations/Monster01/Monster01-animation_12.png',
  monster01_13: 'src/assets/monsters/animations/Monster01/Monster01-animation_13.png',
  monster01_14: 'src/assets/monsters/animations/Monster01/Monster01-animation_14.png',
  monster01_15: 'src/assets/monsters/animations/Monster01/Monster01-animation_15.png',
  monster01_16: 'src/assets/monsters/animations/Monster01/Monster01-animation_16.png',
  monster01_17: 'src/assets/monsters/animations/Monster01/Monster01-animation_17.png',
  monster01_18: 'src/assets/monsters/animations/Monster01/Monster01-animation_18.png',
  monster01_19: 'src/assets/monsters/animations/Monster01/Monster01-animation_19.png',
  
  monster02_00: 'src/assets/monsters/animations/Monster02/Monster02-animation_00.png',
  monster02_01: 'src/assets/monsters/animations/Monster02/Monster02-animation_01.png',
  monster02_02: 'src/assets/monsters/animations/Monster02/Monster02-animation_02.png',
  monster02_03: 'src/assets/monsters/animations/Monster02/Monster02-animation_03.png',
  monster02_04: 'src/assets/monsters/animations/Monster02/Monster02-animation_04.png',
  monster02_05: 'src/assets/monsters/animations/Monster02/Monster02-animation_05.png',
  monster02_06: 'src/assets/monsters/animations/Monster02/Monster02-animation_06.png',
  monster02_07: 'src/assets/monsters/animations/Monster02/Monster02-animation_07.png',
  monster02_08: 'src/assets/monsters/animations/Monster02/Monster02-animation_08.png',
  monster02_09: 'src/assets/monsters/animations/Monster02/Monster02-animation_09.png',
  monster02_10: 'src/assets/monsters/animations/Monster02/Monster02-animation_10.png',
  monster02_11: 'src/assets/monsters/animations/Monster02/Monster02-animation_11.png',
  monster02_12: 'src/assets/monsters/animations/Monster02/Monster02-animation_12.png',
  monster02_13: 'src/assets/monsters/animations/Monster02/Monster02-animation_13.png',
  monster02_14: 'src/assets/monsters/animations/Monster02/Monster02-animation_14.png',
  monster02_15: 'src/assets/monsters/animations/Monster02/Monster02-animation_15.png',
  monster02_16: 'src/assets/monsters/animations/Monster02/Monster02-animation_16.png',
  monster02_17: 'src/assets/monsters/animations/Monster02/Monster02-animation_17.png',
  monster02_18: 'src/assets/monsters/animations/Monster02/Monster02-animation_18.png',
  monster02_19: 'src/assets/monsters/animations/Monster02/Monster02-animation_19.png',
  
  monster03_00: 'src/assets/monsters/animations/Monster03/Monster03-animation_00.png',
  monster03_01: 'src/assets/monsters/animations/Monster03/Monster03-animation_01.png',
  monster03_02: 'src/assets/monsters/animations/Monster03/Monster03-animation_02.png',
  monster03_03: 'src/assets/monsters/animations/Monster03/Monster03-animation_03.png',
  monster03_04: 'src/assets/monsters/animations/Monster03/Monster03-animation_04.png',
  monster03_05: 'src/assets/monsters/animations/Monster03/Monster03-animation_05.png',
  monster03_06: 'src/assets/monsters/animations/Monster03/Monster03-animation_06.png',
  monster03_07: 'src/assets/monsters/animations/Monster03/Monster03-animation_07.png',
  monster03_08: 'src/assets/monsters/animations/Monster03/Monster03-animation_08.png',
  monster03_09: 'src/assets/monsters/animations/Monster03/Monster03-animation_09.png',
  monster03_10: 'src/assets/monsters/animations/Monster03/Monster03-animation_10.png',
  monster03_11: 'src/assets/monsters/animations/Monster03/Monster03-animation_11.png',
  monster03_12: 'src/assets/monsters/animations/Monster03/Monster03-animation_12.png',
  monster03_13: 'src/assets/monsters/animations/Monster03/Monster03-animation_13.png',
  monster03_14: 'src/assets/monsters/animations/Monster03/Monster03-animation_14.png',
  monster03_15: 'src/assets/monsters/animations/Monster03/Monster03-animation_15.png',
  monster03_16: 'src/assets/monsters/animations/Monster03/Monster03-animation_16.png',
  monster03_17: 'src/assets/monsters/animations/Monster03/Monster03-animation_17.png',
  monster03_18: 'src/assets/monsters/animations/Monster03/Monster03-animation_18.png',
  monster03_19: 'src/assets/monsters/animations/Monster03/Monster03-animation_19.png',

};

export const resourceManager = {
  textures: {},
  load(callback) {
    const imagePaths = Object.values(resources);
    const imageKeys = Object.keys(resources);
    let loadedCount = 0;
    if (imagePaths.length === 0) { callback(); return; }
    imagePaths.forEach((path, index) => {
      const key = imageKeys[index];
      const image = createImage();
      image.src = path;
      image.onload = () => {
        this.textures[key] = image;
        loadedCount++;
        if (loadedCount === imagePaths.length) callback();
      };
      image.onerror = () => {
        loadedCount++;
        if (loadedCount === imagePaths.length) callback();
      };
    });
  }
};