module.exports = {
  setupFiles: ['./tests/setup/setEnvironment.js'],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules',
    '/dist'
  ],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.jest.json'
    }
  },
  roots: [
    'tests'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1'
  }
};
