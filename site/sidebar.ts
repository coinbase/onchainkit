import type { Sidebar } from 'vocs';

export const sidebar = [
  {
    text: 'Introduction',
    items: [{ text: 'Getting Started', link: '/getting-started' }],
  },
  {
    text: 'Guides',
    items: [
      {
        text: 'Contribution',
        link: '/guides/contribution',
      },
      {
        text: 'Tailwindcss Integration',
        link: '/guides/tailwind',
      },
    ],
  },
  {
    text: 'Config',
    items: [
      {
        text: 'Components',
        items: [
          {
            text: 'OnchainKitProvider',
            link: '/config/onchainkit-provider',
          },
        ],
      },
      {
        text: 'Utilities',
        collapsed: true,
        items: [
          {
            text: 'isBase',
            link: '/config/is-base',
          },
        ],
      },
      {
        text: 'Types',
        link: '/config/types',
      },
    ],
  },
  {
    text: 'Frame',
    items: [
      {
        text: 'Components',
        items: [
          {
            text: 'FrameMetadata',
            link: '/frame/frame-metadata',
          },
        ],
      },
      {
        text: 'Utilities',
        collapsed: true,
        items: [
          {
            text: 'getFrameHtmlResponse',
            link: '/frame/get-frame-html-response',
          },
          {
            text: 'getFrameMessage',
            link: '/frame/get-frame-message',
          },
          {
            text: 'getFrameMetadata',
            link: '/frame/get-frame-metadata',
          },
        ],
      },
      {
        text: 'Framegear',
        link: '/frame/framegear',
      },
      {
        text: 'Types',
        link: '/frame/types',
      },
    ],
  },
  {
    text: 'Identity',
    items: [
      { text: 'Introduction', link: '/identity/introduction' },
      {
        text: 'Components',
        items: [
          {
            text: 'Address',
            link: '/identity/address',
          },
          {
            text: 'Avatar',
            link: '/identity/avatar',
          },
          {
            text: 'Badge',
            link: '/identity/badge',
          },
          {
            text: 'Identity',
            link: '/identity/identity',
          },
          {
            text: 'Name',
            link: '/identity/name',
          },
        ],
      },
      {
        text: 'Utilities',
        collapsed: true,
        items: [
          {
            text: 'getAvatar',
            link: '/identity/get-avatar',
          },
          {
            text: 'getAttestations',
            link: '/identity/get-attestations',
          },
          {
            text: 'getName',
            link: '/identity/get-name',
          },
          {
            text: 'useName',
            link: '/identity/use-name',
          },
          {
            text: 'useAvatar',
            link: '/identity/use-avatar',
          },
        ],
      },
      {
        text: 'Types',
        link: '/identity/types',
      },
    ],
  },
  {
    text: 'Swap',
    items: [
      {
        text: 'Components',
        items: [
          {
            text: 'Swap',
            link: '/swap/swap',
          },
        ],
      },
      {
        text: 'Utilities',
        collapsed: true,
        items: [
          {
            text: 'getSwapQuote',
            link: '/swap/get-swap-quote',
          },
          {
            text: 'buildSwapTransaction',
            link: '/swap/build-swap-transaction',
          },
        ],
      },
      {
        text: 'Types',
        link: '/swap/types',
      },
    ],
  },
  {
    text: 'Token',
    items: [
      { text: 'Introduction', link: '/token/introduction' },
      {
        text: 'Components',
        items: [
          {
            text: 'TokenChip',
            link: '/token/token-chip',
          },
          {
            text: 'TokenImage',
            link: '/token/token-image',
          },
          {
            text: 'TokenRow',
            link: '/token/token-row',
          },
          {
            text: 'TokenSearch',
            link: '/token/token-search',
          },
          {
            text: 'TokenSelectDropdown',
            link: '/token/token-select-dropdown',
          },
        ],
      },
      {
        text: 'Utilities',
        collapsed: true,
        items: [
          {
            text: 'formatAmount',
            link: '/token/format-amount',
          },
          {
            text: 'getTokens',
            link: '/token/get-tokens',
          },
        ],
      },
      {
        text: 'Types',
        link: '/token/types',
      },
    ],
  },
  {
    text: 'Wallet',
    items: [
      { text: 'Introduction', link: '/wallet/introduction' },
      {
        text: 'Components',
        items: [
          {
            text: 'ConnectAccount',
            link: '/wallet/connect-account',
          },
        ],
      },
      {
        text: 'Utilities',
        collapsed: true,
        items: [
          {
            text: 'isValidAAEntrypoint',
            link: '/wallet/is-valid-aa-entrypoint',
          },
          {
            text: 'isWalletACoinbaseSmartWallet',
            link: '/wallet/is-wallet-a-coinbase-smart-wallet',
          },
        ],
      },
      {
        text: 'Types',
        link: '/wallet/types',
      },
    ],
  },
  {
    text: 'Farcaster',
    collapsed: true,
    items: [
      {
        text: 'Introduction',
        link: '/farcaster/introduction',
      },
      {
        text: 'Utilities',
        items: [
          {
            text: 'getFarcasterUserAddress',
            link: '/farcaster/get-farcaster-user-address',
          },
        ],
      },
      {
        text: 'Types',
        link: '/farcaster/types',
      },
    ],
  },
  {
    text: 'XMTP',
    collapsed: true,
    items: [
      { text: 'Introduction', link: '/xmtp/introduction' },
      {
        text: 'Utilities',
        items: [
          {
            text: 'getXmtpFrameMessage',
            link: '/xmtp/get-xmtp-frame-message',
          },
          {
            text: 'isXmtpFrameRequest',
            link: '/xmtp/is-xmtp-frame-request',
          },
        ],
      },
    ],
  },
] as const satisfies Sidebar;
