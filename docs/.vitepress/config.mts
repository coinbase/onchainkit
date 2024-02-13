import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'OnchainKit',
  description:
    'A collection of tools to build world-class onchain apps with CSS, React, and Typescript.',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
    ],

    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Farcaster Kit', link: '/farcaster-kit' },
          { text: 'Frame Kit', link: '/frame-kit' },
          { text: 'Identity Kit', link: '/identity-kit' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/coinbase/onchainkit' }],
  },
});
