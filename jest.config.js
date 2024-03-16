module.exports = {
  coverageThreshold: {
    global: {
      branches: 93.4,
      functions: 100,
      lines: 96.6,
      statements: 96.7,
    },
  },
  modulePathIgnorePatterns: ['<rootDir>/framegear/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/?(*.)+(spec|test|integ).{ts,tsx}'],
};
