const TurretArea = require('../areas/TurretArea.js');

// 用例：验证生成的一级炮塔可以被拾取并进入拖拽状态

function assert(cond, msg) { if (!cond) throw new Error(msg || 'Assertion failed'); }

function testPickSpawnedLevel1() {
  const bounds = { x: 0, y: 0, width: 400, height: 200 };
  const area = new TurretArea(bounds);
  area.createGrid();
  const slot = area.slots[0];
  slot.occupy(1);
  const touches = [{ clientX: slot.x, clientY: slot.y }];
  area.onTouchStart(touches);
  assert(!!area.draggingTank && area.draggingTank.level === 1, 'should pick level-1 tank');
}

module.exports = {
  tests: [
    ['drag pick level-1', testPickSpawnedLevel1],
  ]
};
