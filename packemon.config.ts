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
};

export default config;
