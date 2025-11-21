const { styles } = require('./styles.js');

function computeAreaRects(width, height) {
  const gridH = styles.turret.rows * styles.turret.outerSize + (styles.turret.rows - 1) * styles.turret.spacing;
  let turretH = gridH + styles.turret.spacing * 2;
  let shootingH = styles.shooting.spotHeight + styles.turret.spacing * 2;
  let buttonsH = 60 + styles.turret.spacing * 2;
  let monsterH = height - turretH - shootingH - buttonsH;
  if (monsterH < 1) {
    const deficit = 1 - monsterH;
    const reducibleButtons = Math.max(0, buttonsH - 1);
    const take = Math.min(deficit, reducibleButtons);
    buttonsH -= take;
    monsterH += take;
  }
  if (monsterH < 1) monsterH = 1;
  const monster = { x: 0, y: 0, width, height: monsterH };
  const shooting = { x: 0, y: monsterH, width, height: shootingH };
  const turret = { x: 0, y: monsterH + shootingH, width, height: turretH };
  const buttons = { x: 0, y: monsterH + shootingH + turretH, width, height: buttonsH };
  return { monster, shooting, turret, buttons };
}

module.exports = { computeAreaRects };