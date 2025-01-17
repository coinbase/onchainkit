import type { ConfigFile } from 'packemon/src/types';

const config: ConfigFile = {
  babelInput(config) {
    config.plugins?.push([
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./src'],
        alias: {
          '@/core': './src/core',
          '@/core-react': './src/core-react',
          '@/ui-react': './src/ui/react',
          '@': './src',
        },
      },
    ]);
  },

  rollupInput(config) {
    // Add onwarn handler to silence MODULE_LEVEL_DIRECTIVE warnings
    config.onwarn = (warning, defaultHandler) => {
      console.log('warning', warning);
      if (
        warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
        warning.message.includes('use client')
      ) {
        return;
      }
      // defaultHandler(warning);
      return console.log('this is a warning');
    };

    console.log('config', config.onwarn);
  },

  // Adding support for React 18's "use client" directive
  // Mostly used with Next.js apps
  rollupOutput(config) {
    if (!config?.plugins || !Array.isArray(config.plugins)) {
      return;
    }

    config.plugins.push({
      name: 'fix-use-client',
      renderChunk(code) {
        if (code.includes("'use client'")) {
          // Remove the original directive and split into lines
          const lines = code.replace("'use client';", '').split('\n');
          // Filter out any empty lines and reconstruct
          return {
            code: `'use client';\n${lines.filter((line) => line.trim()).join('\n')}`,
            map: null,
          };
        }
        return null; // Return null to keep the original code (https://rollupjs.org/plugin-development/#renderchunk)
      },
    });
  },
};

export default config;
