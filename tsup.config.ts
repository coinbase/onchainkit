// biome-ignore lint/correctness/noNodejsModules: We need this for development only
import { spawnSync } from 'node:child_process';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/**/index.ts',
    'src/**/theme.ts',
    'src/**/styles.css',
    'src/**/*.tsx',
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.test.tsx',
  ],
  format: 'esm',
  minify: false, // Disable minification during development
  splitting: true, // Enable code splitting to properly handle React contexts
  // treeshake: true, // Enable tree shaking
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.jsxImportSource = 'react';
  },
  sourcemap: true,
  outDir: 'playground/nextjs-app-router/onchainkit/esm',
  dts: false,
  clean: false,
  silent: false,
  inject: ['react-shim.js'],
  // Generate declaration files separately to improve performance in development
  async onSuccess() {
    console.log('Building declaration files.');
    spawnSync(
      'tsc',
      [
        '--emitDeclarationOnly',
        '--declaration',
        '--outDir',
        'playground/nextjs-app-router/onchainkit/esm',
        '--rootDir',
        'src',
        'src/index.ts',
        'src/*.ts',
        'src/**/index.ts',
        'src/**/theme.ts',
        '--incremental',
        '--tsBuildInfoFile',
        'playground/nextjs-app-router/onchainkit/esm/tsbuildinfo.json',
        '--jsx',
        'react-jsx',
      ],
      {
        shell: true,
      },
    );

    console.log('Declaration files generated.');
  },
});
