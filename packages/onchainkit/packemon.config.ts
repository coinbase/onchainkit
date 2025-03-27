const config = {
  babelInput(config) {
    config.plugins?.push([
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ]);
  },

  // Adding support for React 18's "use client" directive
  // Mostly used with Next.js apps
  rollupOutput(config) {
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
