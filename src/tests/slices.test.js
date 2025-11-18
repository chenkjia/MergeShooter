const { threeSliceRects, nineSliceRects } = require('../core/slices.js');

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'Assertion failed');
}

function testThreeSliceBasic() {
  const imgW = 300, imgH = 100, sliceW = 100;
  const dstW = 600, dstH = 50;
  const rects = threeSliceRects(imgW, imgH, dstW, dstH, sliceW);
  assert(rects.length === 3, 'threeSlice should produce 3 rects when middle > 0');
  const capDW = sliceW * (dstH / imgH);
  assert(Math.abs(rects[0].dw - capDW) < 0.0001, 'left cap width scaled');
  assert(rects[1].sw === imgW - sliceW * 2, 'middle source width correct');
  assert(Math.abs(rects[1].dw - (dstW - capDW * 2)) < 0.0001, 'middle dest width correct');
  assert(Math.abs(rects[2].dx - (dstW - capDW)) < 0.0001, 'right cap position correct');
}

function testThreeSliceNoMiddle() {
  const imgW = 40, imgH = 10, sliceW = 20;
  const dstW = 10, dstH = 10;
  const rects = threeSliceRects(imgW, imgH, dstW, dstH, sliceW);
  assert(rects.length === 2, 'no middle when dstW too small');
}

function testNineSliceBasic() {
  const sw = 100, sh = 100, s = 10;
  const dw = 300, dh = 200;
  const rects = nineSliceRects(sw, sh, dw, dh, s);
  assert(rects.length === 9, 'nineSlice should produce 9 rects');
  assert(rects[4].dx === s && rects[4].dy === s, 'center dest origin');
  assert(rects[4].dw === dw - s * 2 && rects[4].dh === dh - s * 2, 'center dest size');
}

module.exports = {
  tests: [
    ['threeSlice basic', testThreeSliceBasic],
    ['threeSlice no middle', testThreeSliceNoMiddle],
    ['nineSlice basic', testNineSliceBasic],
  ]
};