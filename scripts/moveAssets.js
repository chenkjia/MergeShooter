const fs = require('fs');
const path = require('path');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function moveIfExists(src, dst) {
  if (fs.existsSync(src)) {
    ensureDir(path.dirname(dst));
    fs.renameSync(src, dst);
    return true;
  }
  return false;
}

function moveBullets() {
  const srcBase = path.resolve('doc/Bullets');
  const dstBase = path.resolve('src/assets/bullets');
  ensureDir(dstBase);
  for (let n = 1; n <= 8; n++) {
    moveIfExists(path.join(srcBase, `${n}.png`), path.join(dstBase, `${n}.png`));
  }
}

function moveGuns() {
  const dstBase = path.resolve('src/assets/tanks/guns');
  ensureDir(dstBase);
  // Guns 01..10
  for (let i = 1; i <= 10; i++) {
    const id = String(i).padStart(2, '0');
    const gunDir = path.resolve(`doc/Guns/Gun${id}`);
    moveIfExists(path.join(gunDir, `Idle/Gun${id}-Idle_0.png`), path.join(dstBase, `Gun${id}-Idle_0.png`));
    for (let f = 0; f <= 9; f++) {
      const idx = String(f).padStart(2, '0');
      moveIfExists(path.join(gunDir, `Shoot/Gun${id}-Shoot_${idx}.png`), path.join(dstBase, `Gun${id}-Shoot_${idx}.png`));
    }
  }
  // Guns 11..20 (TurretXX -> GunYY)
  for (let i = 11; i <= 20; i++) {
    const id = String(i).padStart(2, '0');
    const tur = String(i - 10).padStart(2, '0');
    const gunDir = path.resolve(`doc/Guns/Gun${id}`);
    moveIfExists(path.join(gunDir, `Idle/Turret${tur}-Idle_0.png`), path.join(dstBase, `Gun${id}-Idle_0.png`));
    for (let f = 0; f <= 19; f++) {
      const idx = String(f).padStart(2, '0');
      moveIfExists(path.join(gunDir, `Shoot/Turret${tur}-Shoot_${idx}.png`), path.join(dstBase, `Gun${id}-Shoot_${idx}.png`));
    }
  }
}

function moveMonsters() {
  // Monsters 11..15 (source folder uses Monster01..Monster05 base names)
  const nameMap = { 11: '01', 12: '02', 13: '03', 14: '04', 15: '05' };
  for (let m = 11; m <= 15; m++) {
    const mid = String(m).padStart(2, '0');
    const srcBaseName = nameMap[m];
    const srcBase = path.resolve(`doc/Monster/Monster${mid}`);
    const dstBase = path.resolve(`src/assets/monsters/animations/Monster${mid}`);
    ensureDir(dstBase);
    for (let f = 0; f <= 24; f++) {
      const idx = String(f).padStart(2, '0');
      const srcFile = path.join(srcBase, `Monster${srcBaseName}-animation_${idx}.png`);
      const dstFile = path.join(dstBase, `Monster${mid}-animation_${idx}.png`);
      moveIfExists(srcFile, dstFile);
    }
  }
  // Boss 01..05 (Bos -> Boss)
  for (let b = 1; b <= 5; b++) {
    const bid = String(b).padStart(2, '0');
    const srcBase = path.resolve(`doc/Monster/Bos${bid}`);
    const dstBase = path.resolve(`src/assets/monsters/boss/Boss${bid}`);
    ensureDir(dstBase);
    for (let f = 0; f <= 24; f++) {
      const idx = String(f).padStart(2, '0');
      moveIfExists(path.join(srcBase, `Bos${bid}-animation_${idx}.png`), path.join(dstBase, `Boss${bid}-animation_${idx}.png`));
    }
  }
}

function main() {
  moveBullets();
  moveGuns();
  moveMonsters();
  console.log('Assets moved where present.');
}

main();
