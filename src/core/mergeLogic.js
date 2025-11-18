const { maxLevel } = require('../data/cannons.js');

function computeDropResult(draggingTank, dragStartSlot, dragOverSlot) {
  if (!draggingTank) return { type: 'noop' };
  if (!dragOverSlot) return { type: 'move_back' };
  if (dragOverSlot.isOccupied()) {
    if (dragOverSlot.tank && dragOverSlot.tank.level === draggingTank.level) {
      const next = dragOverSlot.tank.level + 1;
      if (next > maxLevel) return { type: 'move_back' };
      return { type: 'merge', level: next };
    }
    return { type: 'move_back' };
  }
  return { type: 'move_to', level: draggingTank.level };
}

module.exports = { computeDropResult };
