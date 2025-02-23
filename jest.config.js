require('dotenv/config');
const { resolve } = require('path');
const root = resolve(__dirname);
const os = require('os');

/**
 * @type {import('jest').Config}
 */
module.exports = {
	clearMocks: true,
	collectCoverageFrom: [
		'<rootDir>/src/**/*.ts',

		// Ignore:
		// '!<rootDir>/src/main.ts',
		// '!<rootDir>/src/app.module.ts',

		// '!<rootDir>/src/config/**',

		// '!<rootDir>/src/**/dtos/**',
		// '!<rootDir>/src/**/swagger/**',

		// '!<rootDir>/src/shared/constants/**',
		// '!<rootDir>/src/shared/database/**',
		// '!<rootDir>/src/shared/styles/**',
		// '!<rootDir>/src/shared/swagger/**',
		'!<rootDir>/src/shared/types/**',
		'!<rootDir>/src/shared/models/**',
		// '!<rootDir>/src/shared/functions/logger.ts',

	],
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	moduleNameMapper: {
		'@/tests/(.*)': '<rootDir>/tests/$1',
		'@/(.*)': '<rootDir>/src/$1'
	},
	preset: 'ts-jest',
	rootDir: root,
	roots: ['<rootDir>/tests'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	testEnvironment: 'node',
	maxWorkers: process.env.JEST_MAX_WORKERS
		? parseInt(process.env.JEST_MAX_WORKERS)
		: os.cpus().length
};
