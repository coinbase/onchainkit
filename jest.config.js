module.exports = {
  modulePathIgnorePatterns: ['<rootDir>/framegear/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/?(*.)+(spec|test|integ).{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
