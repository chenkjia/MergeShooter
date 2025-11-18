function threeSliceRects(imgW, imgH, dstW, dstH, sliceW) {
  const capDW = sliceW * (dstH / imgH);
  const middleSW = imgW - sliceW * 2;
  const middleDW = Math.max(0, dstW - capDW * 2);
  const rects = [];
  rects.push({ sx: 0, sy: 0, sw: sliceW, sh: imgH, dx: 0, dy: 0, dw: capDW, dh: dstH });
  if (middleDW > 0) {
    rects.push({ sx: sliceW, sy: 0, sw: middleSW, sh: imgH, dx: capDW, dy: 0, dw: middleDW, dh: dstH });
  }
  rects.push({ sx: imgW - sliceW, sy: 0, sw: sliceW, sh: imgH, dx: dstW - capDW, dy: 0, dw: capDW, dh: dstH });
  return rects;
}

function nineSliceRects(sw, sh, dw, dh, s) {
  const l = s, r = s, t = s, b = s;
  const scw = sw - l - r;
  const sch = sh - t - b;
  const dcw = dw - l - r;
  const dch = dh - t - b;
  return [
    { sx: 0, sy: 0, sw: l, sh: t, dx: 0, dy: 0, dw: l, dh: t },
    { sx: l, sy: 0, sw: scw, sh: t, dx: l, dy: 0, dw: dcw, dh: t },
    { sx: sw - r, sy: 0, sw: r, sh: t, dx: dw - r, dy: 0, dw: r, dh: t },
    { sx: 0, sy: t, sw: l, sh: sch, dx: 0, dy: t, dw: l, dh: dch },
    { sx: l, sy: t, sw: scw, sh: sch, dx: l, dy: t, dw: dcw, dh: dch },
    { sx: sw - r, sy: t, sw: r, sh: sch, dx: dw - r, dy: t, dw: r, dh: dch },
    { sx: 0, sy: sh - b, sw: l, sh: b, dx: 0, dy: dh - b, dw: l, dh: b },
    { sx: l, sy: sh - b, sw: scw, sh: b, dx: l, dy: dh - b, dw: dcw, dh: b },
    { sx: sw - r, sy: sh - b, sw: r, sh: b, dx: dw - r, dy: dh - b, dw: r, dh: b },
  ];
}

module.exports = { threeSliceRects, nineSliceRects };