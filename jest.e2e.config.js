const { resolve } = require('path');
const root = resolve(__dirname);
const rootConfigPath = resolve(root, 'jest.config.js');

/**
 * @type {import('jest').Config}
 */
const config = require(rootConfigPath);


config.testMatch = [
	'<rootDir>/tests/e2e/**/*.test.ts',
	'<rootDir>/tests/e2e/**/*.spec.ts'
];

module.exports = config;
