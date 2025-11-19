// Debug test loading
const { tests: explosionIntegration } = require('./explosion-integration.test.js');

console.log('Integration tests loaded:', explosionIntegration.length);
console.log('Test names:', explosionIntegration.map(test => test[0]));

// Run one test manually
if (explosionIntegration.length > 0) {
  try {
    explosionIntegration[0][1]();
    console.log('First integration test passed');
  } catch (e) {
    console.log('First integration test failed:', e.message);
  }
}