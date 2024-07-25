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
        statements: 96.08,
        branches: 97.38,
        functions: 90.27,
        lines: 96.08,
      },
    },
    environment: 'jsdom',
    exclude: ['**/node_modules/**', 'site/**'],
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
});
