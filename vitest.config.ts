import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        '**.js',
        '**.ts',
        '**/**.stories.**',
        '**/index.ts',
        '**/types.ts',
        '**/getMockFrameRequest.ts',
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
        statements: 95.49,
        branches: 97.85,
        functions: 90.96,
        lines: 95.49,
      },
    },
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
});
