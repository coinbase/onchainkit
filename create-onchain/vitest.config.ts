// biome-ignore lint/correctness/noNodejsModules: Needed for vite resolving
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
        "src/manifest/**",
        'create-onchain/dist/**',
        '**/*.d.ts',
        'node_modules/**',        
      ],
      reportOnFailure: true,
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    environment: 'jsdom',
    exclude: [
      "src/manifest/**",
      'create-onchain/dist/**',
      '**/*.d.ts',
      'node_modules/**',
    ],
    globals: true,
  },
});
