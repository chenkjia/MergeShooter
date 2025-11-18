const { tests: slices } = require('./slices.test.js');
const { tests: merge } = require('./mergeLogic.test.js');
const { tests: hit } = require('./hit.test.js');

const all = [...slices, ...merge, ...hit];
let passed = 0, failed = 0;
for (const [name, fn] of all) {
  try {
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
