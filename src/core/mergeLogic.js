function computeDropResult(draggingTank, dragStartSlot, dragOverSlot) {
  if (!draggingTank) return { type: 'noop' };
  if (!dragOverSlot) return { type: 'move_back' };
  if (dragOverSlot.isOccupied()) {
    if (dragOverSlot.tank && dragOverSlot.tank.level === draggingTank.level) {
      return { type: 'merge', level: dragOverSlot.tank.level + 1 };
    }
    return { type: 'move_back' };
  }
  return { type: 'move_to', level: draggingTank.level };
}

module.exports = { computeDropResult };