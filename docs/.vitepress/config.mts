import { defineConfig } from 'vitepress';

export const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? '';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'OnchainKit',
  description:
    'A collection of tools to build world-class onchain apps with CSS, React, and Typescript.',
  head: [
    [
      'script',
      { async: '', src: `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}` },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GOOGLE_ANALYTICS_ID}');`,
    ],
  ],
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
