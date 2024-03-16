module.exports = {
  coverageThreshold: {
    global: {
      branches: 97.95,
      functions: 100,
      lines: 98.88,
      statements: 98.9,
    },
  },
  modulePathIgnorePatterns: ['<rootDir>/framegear/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/?(*.)+(spec|test|integ).{ts,tsx}'],
};
