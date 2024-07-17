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
        statements: 93.96,
        branches: 97.3,
        functions: 86.82,
        lines: 93.97,
      },
    },
    environment: 'jsdom',
    exclude: [
      '**/node_modules/**',
      'site/**',
    ],
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
});
