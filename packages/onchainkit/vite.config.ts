import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import preserveUseClientDirective from 'rollup-plugin-preserve-use-client';
import { extname, relative, resolve } from 'path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import path from 'node:path';

const entryPoints = Object.fromEntries(
  glob
    .sync('src/**/*.{ts,tsx}', {
      ignore: ['src/**/*.d.ts', 'src/**/*.test.ts', 'src/**/*.test.tsx'],
    })
    .map((file) => [
      // The name of the entry point
      // src/nested/foo.ts becomes nested/foo
      relative('src', file.slice(0, file.length - extname(file).length)),
      // The absolute path to the entry file
      // src/nested/foo.ts becomes /project/src/nested/foo.ts
      fileURLToPath(new URL(file, import.meta.url)),
    ]),
);

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    externalizeDeps(),
    preserveUseClientDirective(),
    react(),
    dts({
      tsconfigPath: './tsconfig.json',
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    }),
  ],
  build: {
    minify: false,
    sourcemap: true,
    emptyOutDir: process.env.NODE_ENV !== 'development',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      input: entryPoints,
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
  },
});
