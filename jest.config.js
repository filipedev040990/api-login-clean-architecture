module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*interface.ts',
    '!<rootDir>/src/**/*helper.ts',
    '!<rootDir>/src/app.ts',
    '!<rootDir>/src/server.ts'

  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
