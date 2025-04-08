/// <reference types="node" />

import { spawnSync } from 'node:child_process';
import { defineConfig } from 'tsup';
import { fixAliasPlugin } from 'esbuild-fix-imports-plugin';

const isWatchMode = process.argv.includes('--watch');

const outDir = 'esm';

export default defineConfig({
  tsconfig: 'tsconfig.dev.json',
  entry: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/*.{test,stories}.{ts,tsx}',
    'src/**/styles.css',
  ],
  format: ['esm'],
  dts: false,
  sourcemap: true,
  clean: false,
  outDir,
  treeshake: false,
  splitting: false,
  bundle: false,
  minify: false,
  keepNames: true,
  silent: false,
  watch: isWatchMode ? ['src/**/*.{ts,tsx}'] : false,
  ignoreWatch: ['**/*.{test,stories}.{ts,tsx}'],
  inject: ['react-shim.js'],
  esbuildPlugins: [fixAliasPlugin()],

  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.jsxImportSource = 'react';
  },

  // Generate declaration files separately to improve performance in development
  async onSuccess() {
    console.log('Generating declaration files...');
    spawnSync(
      'tsc',
      [
        '--emitDeclarationOnly',
        '--declaration',
        '--outDir',
        outDir,
        '--rootDir',
        'src',
        'src/index.ts',
        'src/*.ts',
        'src/**/index.ts',
        'src/**/theme.ts',
        '--incremental',
        '--tsBuildInfoFile',
        `${outDir}/tsbuildinfo.json`,
        '--jsx',
        'react-jsx',
      ],
      {
        shell: true,
      },
    );

    console.log('⚡ Rebuilt onchainkit.');
  },
});
