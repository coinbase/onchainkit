// biome-ignore lint/correctness/noNodejsModules: We need this for development only
import { spawnSync } from 'node:child_process';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/index.ts', 'src/**/theme.ts', 'src/**/styles.css'],
  ignoreWatch: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx'],
  // TODO: update this based on environment, once we switch to tsup for builds
  watch: ['src/**/*.{ts,tsx}'],
  format: 'esm',
  minify: false, // Disable minification during development
  splitting: true, // Enable code splitting to properly handle React contexts
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.jsxImportSource = 'react';
  },
  sourcemap: true,
  outDir: 'playground/nextjs-app-router/onchainkit/esm',
  dts: false,
  clean: false,
  silent: true, // Flip this to false to see tsup output in the terminal, including performance logs
  inject: ['react-shim.js'],

  // Generate declaration files separately to improve performance in development
  async onSuccess() {
    console.log('⚡ Rebuilt onchainkit.');
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

    // Update any type aliases
    spawnSync('tscpaths', [
      '-p',
      'tsconfig.esm.json',
      '-s',
      'src',
      '-o',
      'playground/nextjs-app-router/onchainkit/esm',
    ]);

    // Copy tailwind styles
    spawnSync('cp', [
      'src/styles.css',
      'playground/nextjs-app-router/onchainkit/src/styles.css',
    ]);

    console.log('Declaration files generated.');
  },
});
