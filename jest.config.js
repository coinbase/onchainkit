module.exports = {
  // ...
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/?(*.)+(spec|test|integ).{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
