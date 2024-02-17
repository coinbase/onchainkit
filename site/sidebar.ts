import type { Sidebar } from 'vocs';

export const sidebar = {
  '/docs/': [
    {
      text: 'Introduction',
      items: [
        { text: 'Why Onchainkit', link: '/docs/introduction' },
        { text: 'Getting Started', link: '/docs/getting-started' },
      ],
    },
    {
      text: 'Frame Kit',
      items: [
        { text: 'Introduction', link: '/docs/framekit/intro' },
        {
          text: 'Components',
          items: [
            {
              text: 'FrameMetadata',
              link: '/docs/framekit/components/framemetadata',
            }
          ],
        },
      ],
    }
  ]
} as const satisfies Sidebar;
