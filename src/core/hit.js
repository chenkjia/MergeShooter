function isPointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}

function hitButton(buttons, x, y) {
  for (let i = 0; i < buttons.length; i++) {
    const b = buttons[i];
    if (isPointInRect(x, y, b)) return i;
  }
  return -1;
}

module.exports = { isPointInRect, hitButton };