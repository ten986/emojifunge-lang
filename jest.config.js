module.exports = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/**/*.test.ts'],
  collectCoverage: true,
  errorOnDeprecated: true,
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
