module.exports = {
  coverageThreshold: {
    global: {
      branches: 99.59,
      functions: 100,
      lines: 99.63,
      statements: 99.64,
    },
  },
  modulePathIgnorePatterns: ['<rootDir>/framegear/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/?(*.)+(spec|test|integ).{ts,tsx}'],
};
