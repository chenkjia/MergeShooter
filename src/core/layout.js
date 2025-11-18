const { styles } = require('./styles.js');

function computeAreaRects(width, height) {
  const lp = styles.layout;
  let monsterH = Math.floor(height * lp.monster);
  let shootingH = Math.floor(height * lp.shooting);
  let turretH = Math.floor(height * lp.turret);
  let buttonsH = height - monsterH - shootingH - turretH;
  if (buttonsH < 1) buttonsH = 1;
  const gridH = styles.turret.rows * styles.turret.outerSize + (styles.turret.rows - 1) * styles.turret.spacing;
  const minTurret = gridH + styles.turret.spacing;
  if (turretH < minTurret) {
    let need = minTurret - turretH;
    const minShooting = Math.floor(height * 0.2);
    const minMonster = Math.floor(height * 0.2);
    const minButtons = Math.floor(height * 0.1);
    let take = Math.min(need, Math.max(0, shootingH - minShooting));
    shootingH -= take;
    need -= take;
    if (need > 0) {
      take = Math.min(need, Math.max(0, monsterH - minMonster));
      monsterH -= take;
      need -= take;
    }
    if (need > 0) {
      take = Math.min(need, Math.max(0, buttonsH - minButtons));
      buttonsH -= take;
      need -= take;
    }
    turretH = minTurret;
  }
  const monster = { x: 0, y: 0, width, height: monsterH };
  const shooting = { x: 0, y: monsterH, width, height: shootingH };
  const turret = { x: 0, y: monsterH + shootingH, width, height: turretH };
  const buttons = { x: 0, y: monsterH + shootingH + turretH, width, height: buttonsH };
  return { monster, shooting, turret, buttons };
}

module.exports = { computeAreaRects };