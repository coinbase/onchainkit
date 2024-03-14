module.exports = {
  coverageThreshold: {
    global: {
      branches: 94.8,
      functions: 93,
      lines: 95.5,
      statements: 95.3,
    },
  },
  modulePathIgnorePatterns: ['<rootDir>/framegear/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/?(*.)+(spec|test|integ).{ts,tsx}'],
};
