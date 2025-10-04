import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import preserveUseClientDirective from 'rollup-plugin-preserve-use-client';
import { extname, relative, resolve } from 'path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import path from 'node:path';
import fs from 'fs';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import postcssPrefixClassnames from './plugins/postcss-prefix-classnames.js';
import { babelPrefixReactClassNames } from './plugins/babel-prefix-react-classnames';
import { dualCSSPlugin } from './plugins/vite-dual-css.js';

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

const OCK_VERSION = JSON.parse(
  fs.readFileSync('./package.json', 'utf-8'),
).version;

const CLASSNAME_PREFIX = 'ock:';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    __OCK_VERSION__: JSON.stringify(OCK_VERSION),
    __CLASSNAME_PREFIX__: JSON.stringify(CLASSNAME_PREFIX),
  },
  plugins: [
    externalizeDeps(),
    preserveUseClientDirective() as PluginOption,
    react({
      babel: {
        plugins: [
          babelPrefixReactClassNames({
            prefix: CLASSNAME_PREFIX,
            cnUtil: 'cn',
            universalClass: 'el',
          }),
        ],
      },
    }),
    dts({
      tsconfigPath: './tsconfig.json',
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    }),
    dualCSSPlugin({ scopedFileName: 'onchainkit.css' }), // Generate scoped styles after build
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
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          base: './src',
          optimize: false,
        }),
        autoprefixer(),
        postcssPrefixClassnames({
          prefix: `ock\\:`,
        }),
      ],
    },
  },
});
