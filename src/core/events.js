const listeners = {};

function on(event, handler) {
  if (!listeners[event]) listeners[event] = [];
  listeners[event].push(handler);
}

function off(event, handler) {
  const arr = listeners[event];
  if (!arr) return;
  const i = arr.indexOf(handler);
  if (i >= 0) arr.splice(i, 1);
}

function emit(event, detail) {
  const arr = listeners[event] || [];
  for (let i = 0; i < arr.length; i++) arr[i](detail);
}

module.exports = { on, off, emit };