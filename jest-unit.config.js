const { resolve } = require('path');
const root = resolve(__dirname);
const rootConfigPath = resolve(root, 'jest.config.js');
const config = require(rootConfigPath);

/**
 * @type {import('jest').Config['testMatch']}
 */
config.testMatch = [
	'<rootDir>/tests/unit/**/*.test.ts',
	'<rootDir>/tests/unit/**/*.spec.ts'
];

module.exports = config;
