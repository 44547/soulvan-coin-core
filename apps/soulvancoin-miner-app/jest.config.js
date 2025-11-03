module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'mining/**/*.js',
    'ai/**/*.js',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/output/**'
  ],
  coverageDirectory: 'coverage',
  verbose: true
};
