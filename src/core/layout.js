import { styles } from './styles.js';

export function computeAreaRects(width, height) {
  const lp = styles.layout;
  const monsterH = Math.floor(height * lp.monster);
  const shootingH = Math.floor(height * lp.shooting);
  const turretH = Math.floor(height * lp.turret);
  let buttonsH = height - monsterH - shootingH - turretH;
  if (buttonsH < 1) buttonsH = 1;
  const monster = { x: 0, y: 0, width, height: monsterH };
  const shooting = { x: 0, y: monsterH, width, height: shootingH };
  const turret = { x: 0, y: monsterH + shootingH, width, height: turretH };
  const buttons = { x: 0, y: monsterH + shootingH + turretH, width, height: buttonsH };
  return { monster, shooting, turret, buttons };
}
