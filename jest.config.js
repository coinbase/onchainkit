module.exports = {
  coverageThreshold: {
    global: {
      branches: 95.91,
      functions: 100,
      lines: 97.76,
      statements: 97.81,
    },
  },
  modulePathIgnorePatterns: ['<rootDir>/framegear/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/?(*.)+(spec|test|integ).{ts,tsx}'],
};
