import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        '**.js',
        '**.ts',
        '**/**.stories.**',
        '**/getMockFrameRequest.ts',
        '**/index.ts',
        '**/*Svg.tsx',
        '**/types.ts',
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
        statements: 96.18,
        branches: 97.49,
        functions: 90.86,
        lines: 96.18,
      },
    },
    environment: 'jsdom',
    exclude: ['**/node_modules/**', 'site/**'],
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
});
