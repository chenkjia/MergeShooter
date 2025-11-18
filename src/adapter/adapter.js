const hasTT = typeof tt !== 'undefined' && tt;

function getSystemInfoSync() {
  if (hasTT && typeof tt.getSystemInfoSync === 'function') return tt.getSystemInfoSync();
  const w = typeof window !== 'undefined' ? window : { innerWidth: 800, innerHeight: 600, devicePixelRatio: 1 };
  return {
    windowWidth: w.innerWidth || 800,
    windowHeight: w.innerHeight || 600,
    screenWidth: w.innerWidth || 800,
    screenHeight: w.innerHeight || 600,
    pixelRatio: w.devicePixelRatio || 1,
  };
}

function createCanvas() {
  if (hasTT && typeof tt.createCanvas === 'function') return tt.createCanvas();
  if (typeof document !== 'undefined') return document.createElement('canvas');
  return { getContext: () => null, width: 0, height: 0 };
}

function createImage() {
  if (hasTT && typeof tt.createImage === 'function') return tt.createImage();
  if (typeof Image !== 'undefined') return new Image();
  return { onload: null, onerror: null, src: '' };
}

function onTouchStart(handler) {
  if (hasTT && typeof tt.onTouchStart === 'function') return tt.onTouchStart(handler);
  if (typeof window !== 'undefined') {
    window.addEventListener('touchstart', (e) => handler({ touches: e.touches }));
  }
}

function onTouchMove(handler) {
  if (hasTT && typeof tt.onTouchMove === 'function') return tt.onTouchMove(handler);
  if (typeof window !== 'undefined') {
    window.addEventListener('touchmove', (e) => handler({ touches: e.touches }));
  }
}

function onTouchEnd(handler) {
  if (hasTT && typeof tt.onTouchEnd === 'function') return tt.onTouchEnd(handler);
  if (typeof window !== 'undefined') {
    window.addEventListener('touchend', (e) => handler({ touches: e.touches }));
  }
}

function getStorageSync(key) {
  try {
    if (hasTT && typeof tt.getStorageSync === 'function') return tt.getStorageSync(key);
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : undefined;
    }
  } catch (_) {}
  return undefined;
}

function setStorageSync(key, value) {
  try {
    if (hasTT && typeof tt.setStorageSync === 'function') return tt.setStorageSync(key, value);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (_) {}
}

function raf(cb) {
  if (typeof requestAnimationFrame === 'function') return requestAnimationFrame(cb);
  return setTimeout(cb, 16);
}

function mountCanvas(canvas, width, height) {
  if (hasTT) return;
  if (typeof document !== 'undefined' && canvas) {
    if (!canvas.parentNode) document.body.appendChild(canvas);
    if (canvas.style) {
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.style.position = 'fixed';
      canvas.style.left = '0';
      canvas.style.top = '0';
    }
  }
}

module.exports = { getSystemInfoSync, createCanvas, createImage, onTouchStart, onTouchMove, onTouchEnd, getStorageSync, setStorageSync, raf, mountCanvas };