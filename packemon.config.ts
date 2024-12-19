const config = {
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

  // Adding support for React 18's "use client" directive
  // Mostly used with Next.js apps
  rollupOutput(config) {
    config.banner = "'use client';";
  },
};

export default config;
