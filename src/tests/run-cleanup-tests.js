// Run explosion cleanup tests
const { tests } = require('./explosion-cleanup.test.js');

console.log('Running explosion cleanup tests...');
console.log('Total tests:', tests.length);

let passed = 0, failed = 0;
for (const [name, fn] of tests) {
  try {
    console.log(`\n=== Running: ${name} ===`);
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