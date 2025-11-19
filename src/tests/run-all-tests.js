// Run all tests including integration tests
const { tests: slices } = require('./slices.test.js');
const { tests: merge } = require('./mergeLogic.test.js');
const { tests: hit } = require('./hit.test.js');
const { tests: drag } = require('./drag.test.js');
const { tests: explosion } = require('./explosion-simple.test.js');
const { tests: explosionIntegration } = require('./explosion-integration.test.js');

console.log('Loading test suites...');
console.log('Slices tests:', slices.length);
console.log('Merge tests:', merge.length);
console.log('Hit tests:', hit.length);
console.log('Drag tests:', drag.length);
console.log('Explosion tests:', explosion.length);
console.log('Explosion integration tests:', explosionIntegration.length);

const all = [...slices, ...merge, ...hit, ...drag, ...explosion, ...explosionIntegration];
console.log('Total tests:', all.length);

let passed = 0, failed = 0;
for (const [name, fn] of all) {
  try {
    console.log(`Running: ${name}`);
    fn();
    console.log(`[PASS] ${name}`);
    passed += 1;
  } catch (e) {
    console.log(`[FAIL] ${name}: ${e.message}`);
    failed += 1;
  }
}

console.log(`\nTotal: ${passed + failed}, Passed: ${passed}, Failed: ${failed}`);
if (failed > 0) process.exit(1);