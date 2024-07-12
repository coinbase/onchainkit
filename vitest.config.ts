import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        '**.js',
        '**.ts',
        '**/**.stories.**',
        '**/index.ts',
        '.storybook/**',
        '.yarn/**',
        'esm/**',
        'framegear/**',
        'node_modules/**',
        'onchainkit/esm/**',
        'site/**',
      ],
      reportOnFailure: true,
      thresholds: {
        statements: 95.37,
        branches: 97.39,
        functions: 91.08,
        lines: 95.37,
      },
    },
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
});
