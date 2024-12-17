import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
// biome-ignore lint/correctness/noNodejsModules: Needed for vite resolving
import path from 'node:path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@/core': path.resolve(__dirname, '../src/core'),
          '@/core-react': path.resolve(__dirname, '../src/core-react'),
          '@/ui-react': path.resolve(__dirname, '../src/ui/react'),
          '@': path.resolve(__dirname, '../src'),
        },
      },
    });
  },
};

export default config;
