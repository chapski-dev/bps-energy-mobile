/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  maxWorkers: 1,
  reporters: ['detox/runners/jest/reporter'],
  rootDir: '..',
  testEnvironment: 'detox/runners/jest/testEnvironment',
  testMatch: ['<rootDir>/e2e/**/*.test.js'],
  testTimeout: 300000,
  verbose: true,
};
