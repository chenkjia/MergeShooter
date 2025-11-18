const { computeDropResult } = require('../core/mergeLogic.js');

function assert(cond, msg) { if (!cond) throw new Error(msg || 'Assertion failed'); }

function makeSlot(occupiedLevel) {
  return {
    tank: occupiedLevel ? { level: occupiedLevel } : null,
    isOccupied() { return !!this.tank; },
    occupy(level) { this.tank = { level }; }
  };
}

function testMergeSameLevel() {
  const dragging = { level: 1 };
  const startSlot = makeSlot(1);
  const overSlot = makeSlot(1);
  const res = computeDropResult(dragging, startSlot, overSlot);
  assert(res.type === 'merge' && res.level === 2, 'merge to level+1');
}

function testMoveToEmpty() {
  const dragging = { level: 2 };
  const startSlot = makeSlot(2);
  const overSlot = makeSlot(null);
  const res = computeDropResult(dragging, startSlot, overSlot);
  assert(res.type === 'move_to' && res.level === 2, 'move to empty');
}

function testMoveBackDifferentLevel() {
  const dragging = { level: 1 };
  const startSlot = makeSlot(1);
  const overSlot = makeSlot(2);
  const res = computeDropResult(dragging, startSlot, overSlot);
  assert(res.type === 'move_back', 'move back when different levels');
}

function testMoveBackNoTarget() {
  const dragging = { level: 3 };
  const startSlot = makeSlot(3);
  const res = computeDropResult(dragging, startSlot, null);
  assert(res.type === 'move_back', 'move back when no over slot');
}

function testMergeCapToEight() {
  const dragging = { level: 7 };
  const startSlot = makeSlot(7);
  const overSlot = makeSlot(7);
  const res = computeDropResult(dragging, startSlot, overSlot);
  assert(res.type === 'merge' && res.level === 8, 'merge to level 8');
}

function testMergeBeyondEightBlocked() {
  const dragging = { level: 8 };
  const startSlot = makeSlot(8);
  const overSlot = makeSlot(8);
  const res = computeDropResult(dragging, startSlot, overSlot);
  assert(res.type === 'move_back', 'merge 8+8 should move back');
}

module.exports = {
  tests: [
    ['merge same level', testMergeSameLevel],
    ['move to empty', testMoveToEmpty],
    ['move back different level', testMoveBackDifferentLevel],
    ['move back no target', testMoveBackNoTarget],
    ['merge cap to 8', testMergeCapToEight],
    ['merge 8+8 blocked', testMergeBeyondEightBlocked],
  ]
};
