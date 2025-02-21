const { resolve } = require('path');
const root = resolve(__dirname);
const rootConfigPath = resolve(root, 'jest.config.js');
const config = require(rootConfigPath);

/**
 * @type {import('jest').Config['testMatch']}
 */
config.testMatch = [
	'<rootDir>/tests/e2e/**/*.test.ts',
	'<rootDir>/tests/e2e/**/*.spec.ts'
];

module.exports = config;
