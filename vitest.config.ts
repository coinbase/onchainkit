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
        'playground/**',
        'site/**',
      ],
      reportOnFailure: true,
      thresholds: {
        statements: 99.28,
        branches: 98.27,
        functions: 94.47,
        lines: 99.28,
      },
    },
    environment: 'jsdom',
    exclude: ['**/node_modules/**', 'playground/**', 'site/**'],
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
});
