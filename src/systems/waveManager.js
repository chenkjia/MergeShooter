const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

export const WaveManager = () => {
  let currentWave = 0;
  let active = false;
  let remaining = 0;
  const getIntervalMs = (wave) => {
    const ms = 5000 - (wave - 1) * 100;
    return clamp(ms, 1000, 5000);
  };
  const getType = (wave) => {
    if (wave % 20 === 0) return 'boss';
    if (wave % 10 === 0) return 'elite';
    return 'normal';
  };
  const spawn = (gameState, resourceManager, createMonster) => {
    const type = getType(currentWave);
    const img = resourceManager.images.monster1;
    if (type === 'boss') {
      const m = createMonster(
        gameState.battleArea.x + gameState.battleArea.width / 2 - 25,
        gameState.battleArea.y + 10,
        img,
        { type: 'boss', baseHp: 100 + currentWave * 20, baseAtk: 5 + currentWave }
      );
      gameState.monsters.push(m);
      remaining = 1;
    } else {
      const count = 5;
      for (let i = 0; i < count; i++) {
        const x = gameState.battleArea.x + 20 + i * 60;
        const y = gameState.battleArea.y + 10;
        const opts = { type: type, baseHp: 60 + currentWave * 15, baseAtk: 3 + currentWave * 0.5 };
        const m = createMonster(x, y, img, opts);
        gameState.monsters.push(m);
      }
      remaining = count;
    }
    active = true;
  };
  const onMonsterKilled = () => {
    if (!active) return false;
    remaining = Math.max(remaining - 1, 0);
    if (remaining === 0) {
      active = false;
      return true;
    }
    return false;
  };
  const nextWave = (gameState, resourceManager, createMonster) => {
    currentWave += 1;
    gameState.wave = currentWave;
    spawn(gameState, resourceManager, createMonster);
  };
  const startFirstWave = (gameState, resourceManager, createMonster) => {
    setTimeout(() => {
      currentWave = 1;
      gameState.wave = 1;
      spawn(gameState, resourceManager, createMonster);
    }, 3000);
  };
  return {
    startFirstWave,
    nextWave,
    onMonsterKilled,
    getIntervalMs,
    getType,
    get currentWave() { return currentWave; },
    get active() { return active; },
  };
};