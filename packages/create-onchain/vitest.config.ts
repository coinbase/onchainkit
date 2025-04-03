import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      TZ: 'UTC',
    },
    coverage: {
      include: ["src/**/*.ts"],
      exclude: [
        'create-onchain/dist/**',
        '**/*.d.ts',
        'node_modules/**',
      ],
      reportOnFailure: true,
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 30,
        lines: 70,
      },
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    environment: 'jsdom',
    exclude: [
      'create-onchain/dist/**',
      '**/*.d.ts',
      'node_modules/**',
    ],
    globals: true,
  },
});
