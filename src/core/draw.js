const { ctx, resourceManager } = require('./context.js');
const { levels } = require('../data/cannons.js');

function drawTankWithBadge(x, y, level, baseInnerSize) {
  const def = levels[level] || null;
  const tankImg = def ? resourceManager.textures[def.textureKey] : null;
  if (!tankImg) return;
  const tankSize = baseInnerSize;
  const dx = Math.floor(x - tankSize / 2);
  const dy = Math.floor(y - tankSize / 2);
  ctx.drawImage(tankImg, dx, dy, tankSize, tankSize);
  const shieldImg = resourceManager.textures['shield_icon'];
  if (shieldImg) {
    const shieldSize = Math.floor(baseInnerSize * 0.6);
    const sx = Math.floor(x + baseInnerSize / 2 - shieldSize*0.8);
    const sy = Math.floor(y + baseInnerSize / 2 - shieldSize*0.8);
    ctx.drawImage(shieldImg, sx, sy, shieldSize, shieldSize);
    const label = String(level || '');
    if (label) {
      const fontSize = Math.floor(baseInnerSize * 0.2);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const tx = Math.floor(sx + shieldSize / 2);
      const ty = Math.floor(sy + shieldSize / 2+2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#000000';
      ctx.fillStyle = '#ffffff';
      ctx.strokeText(label, tx, ty);
      ctx.fillText(label, tx, ty);
    }
  }
}

module.exports = { drawTankWithBadge };