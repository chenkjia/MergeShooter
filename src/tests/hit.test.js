const { hitButton } = require('../core/hit.js');

function assert(cond, msg) { if (!cond) throw new Error(msg || 'Assertion failed'); }

function makeButtons() {
  return [
    { x: 0, y: 0, width: 50, height: 50 },
    { x: 60, y: 0, width: 100, height: 50 },
    { x: 165, y: 0, width: 80, height: 50 },
  ];
}

function testHitFirst() {
  const buttons = makeButtons();
  const idx = hitButton(buttons, 25, 25);
  assert(idx === 0, 'hit first button');
}

function testHitSecond() {
  const buttons = makeButtons();
  const idx = hitButton(buttons, 100, 25);
  assert(idx === 1, 'hit second button');
}

function testMiss() {
  const buttons = makeButtons();
  const idx = hitButton(buttons, 300, 25);
  assert(idx === -1, 'miss all');
}

module.exports = {
  tests: [
    ['hit first', testHitFirst],
    ['hit second', testHitSecond],
    ['miss all', testMiss],
  ]
};