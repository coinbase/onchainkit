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
        statements: 99.1,
        branches: 97.6,
        functions: 93.33,
        lines: 99.1,
      },
    },
    environment: 'jsdom',
    exclude: ['**/node_modules/**', 'playground/**', 'site/**'],
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
});
