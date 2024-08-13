import type { Sidebar } from 'vocs';

export const sidebar = [
  {
    text: 'OnchainKit',
    items: [
      { text: 'Introduction', 
        link: '/introduction', 
      },
      { text: 'Getting Started', 
        link: '/getting-started', 
      },
    ],
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
      {
        text: 'Reporting a bug',
        link: '/guides/reporting-bug',
      },
      {
        text: 'Framegear',
        link: '/frame/framegear',
      },
    ],
  },
  {
    text: 'Templates',
    items: [
      {
        text: 'Quick start app',
        link: 'https://github.com/coinbase/onchain-app-template',
      },
      {
        text: 'Community one-page',
        link: 'https://github.com/fakepixels/token-machine',
      },
      {
        text: 'Frame',
        link: 'https://github.com/Zizzamia/a-frame-in-100-lines',
      },
    ],
  },
  {
    text: 'Components',
    items: [
      {
        text: 'FrameMetadata',
        link: '/frame/frame-metadata',
      },
      {
        text: 'Identity',
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
        text: 'OnchainKitProvider',
        link: '/config/onchainkit-provider',
      },
      {
        text: 'Swap',
        link: '/swap/swap',
      },
      {
        text: 'Token',
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
        text: 'Transaction',
        link: '/transaction/transaction',
      },
      {
        text: 'Wallet',
        link: '/wallet/wallet',
      },
    ]
  },
  {
    text: 'Utilities',
    collapsed: true,
    items: [
      {
        text: 'buildSwapTransaction',
        link: '/swap/build-swap-transaction',
      },
      {
        text: 'formatAmount',
        link: '/token/format-amount',
      },
      {
        text: 'isBase',
        link: '/config/is-base',
      },
      {
        text: 'isXmtpFrameRequest',
        link: '/xmtp/is-xmtp-frame-request',
      },
      {
        text: 'isValidAAEntrypoint',
        link: '/wallet/is-valid-aa-entrypoint',
      },
      {
        text: 'isWalletACoinbaseSmartWallet',
        link: '/wallet/is-wallet-a-coinbase-smart-wallet',
      },
      {
        text: 'getAttestations',
        link: '/identity/get-attestations',
      },
      {
        text: 'getAvatar',
        link: '/identity/get-avatar',
      },
      {
        text: 'getFarcasterUserAddress',
        link: '/farcaster/get-farcaster-user-address',
      },
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
      {
        text: 'getName',
        link: '/identity/get-name',
      },
      {
        text: 'getSwapQuote',
        link: '/swap/get-swap-quote',
      },
      {
        text: 'getTokens',
        link: '/token/get-tokens',
      },
      {
        text: 'getXmtpFrameMessage',
        link: '/xmtp/get-xmtp-frame-message',
      },
      {
        text: 'useAvatar',
        link: '/identity/use-avatar',
      },
      {
        text: 'useName',
        link: '/identity/use-name',
      },
    ]
  },
  {
    text: 'Types',
    collapsed: true,
    items: [
      {
        text: 'Config',
        link: '/config/types',
      },
      {
        text: 'Farcaster',
        link: '/farcaster/types',
      },
      {
        text: 'Frame',
        link: '/frame/types',
      },
      {
        text: 'Identity',
        link: '/identity/types',
      },
      {
        text: 'Swap',
        link: '/swap/types',
      },
      {
        text: 'Token',
        link: '/token/types',
      },
      {
        text: 'Transaction',
        link: '/transaction/types',
      },
      {
        text: 'Wallet',
        link: '/wallet/types',
      },
    ]
  },
  {
    text: 'Design Resources',
    collapsed: true,
    items: [
      { text: 'Figma UI Kit', 
        link: 'https://www.figma.com/community/file/1370194397345450683/onchainkit', 
      },
    ],
  },
  { text: 'Terms of Service', 
    link: 'https://www.coinbase.com/legal/cloud/terms-of-service', 
  },
  { text: 'MIT License', 
    link: 'https://github.com/coinbase/onchainkit/blob/main/LICENSE.mdc', 
  },
] as const satisfies Sidebar;
