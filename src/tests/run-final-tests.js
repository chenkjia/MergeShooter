// Run final explosion tests
const { tests } = require('./explosion-final.test.js');

console.log('🎮 Running final explosion workflow tests...');
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

console.log(`\n🎯 Final Test Results: Total: ${passed + failed}, Passed: ${passed}, Failed: ${failed}`);
if (failed > 0) {
  console.log('❌ Some tests failed');
  process.exit(1);
} else {
  console.log('✅ All explosion tests passed successfully!');
}