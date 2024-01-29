module.exports = {
  // ...
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: ['**/?(*.)+(spec|test|integ).ts'],
};
