/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'],
    setupFiles: ['jest-plugin-context/setup'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    testPathIgnorePatterns: ['/node_modules/', 'dist'],
    rootDir: '.',
    transform: {
        '^.+\\.ts?$': ['@swc/jest'],
    },
    collectCoverageFrom: ['**/*.(t|j)s', '!**/node_modules/**'],
    roots: ['<rootDir>/'],
    coverageDirectory: '../coverage',
};
