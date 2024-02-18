import type { Sidebar } from 'vocs';

export const sidebar = [
  {
    text: 'Introduction',
    items: [{ text: 'Getting Started', link: '/getting-started' }],
  },
  {
    text: 'Farcaster Kit',
    items: [
      {
        text: 'Introduction',
        link: '/farcasterkit/introduction',
      },
      {
        text: 'Utilities',
        items: [
          {
            text: 'getFarcasterUserAddress',
            link: '/farcasterkit/get-farcaster-user-address',
          },
        ],
      },
      {
        text: 'Types',
        link: '/farcasterkit/types',
      },
    ],
  },
  {
    text: 'Frame Kit',
    items: [{ text: 'Introduction', link: '/framekit/introduction' }],
  },
  {
    text: 'Identity Kit',
    items: [{ text: 'Introduction', link: '/identitykit/introduction' }],
  },
] as const satisfies Sidebar;
