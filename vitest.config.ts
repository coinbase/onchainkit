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
        '**/*Svg.tsx',
      ],
      reportOnFailure: true,
      thresholds: {
        statements: 94.52,
        branches: 97.3,
        functions: 86.82,
        lines: 94.52,
      },
    },
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
});
