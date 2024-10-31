import { defineConfig } from 'tsup';
// biome-ignore lint/correctness/noNodejsModules: We need this for development only
import { spawnSync } from 'node:child_process';

export default defineConfig({
  entry: ['src/**/index.ts', 'src/**/theme.ts', 'src/**/styles.css'],
  format: 'esm',
  minify: false, // Disable minification during development
  splitting: false, // Disable code splitting during development
  sourcemap: true,
  treeshake: false, // Disable tree shaking during development
  outDir: 'playground/nextjs-app-router/onchainkit/esm',
  dts: false,
  clean: true,
  silent: true,
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
