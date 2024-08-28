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
        text: 'Lifecycle Status',
        link: '/guides/lifecycle-status',
      },
      {
        text: 'Use Basename',
        link: '/guides/use-basename-in-onchain-app',
      },
      {
        text: 'Framegear',
        link: '/frame/framegear',
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
        text: 'Contribution',
        link: '/guides/contribution',
      },
    ],
  },
  {
    text: 'Templates',
    items: [
      {
        text: 'Onchain App',
        link: 'https://github.com/coinbase/onchain-app-template',
      },
      {
        text: 'Frame in 100 lines',
        link: 'https://github.com/Zizzamia/a-frame-in-100-lines',
      },
    ],
  },
  {
    text: 'Components',
    items: [
      {
        text: 'Config',
        items: [
          {
            text: 'OnchainKitProvider',
            link: '/config/onchainkit-provider',
          },
        ],
      },
      {
        text: 'Frame',
        items: [
          {
            text: 'FrameMetadata',
            link: '/frame/frame-metadata',
          },
        ],
      },
      {
        text: 'Identity',
        items: [
          {
            text: 'Identity',
            link: '/identity/identity',
          },
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
            text: 'Name',
            link: '/identity/name',
          },
        ],
      },
      {
        text: 'Swap',
        items: [
          {
            text: 'Swap',
            link: '/swap/swap',
          },
        ],
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
        items: [
          {
            text: 'Transaction',
            link: '/transaction/transaction',
          },
        ],
      },
      {
        text: 'Wallet',
        items: [
          {
            text: 'Wallet',
            link: '/wallet/wallet',
          },
          {
            text: 'WalletDropdownBasename',
            link: '/wallet/wallet-dropdown-basename',
          },
          {
            text: 'WalletDropdownDisconnect',
            link: '/wallet/wallet-dropdown-disconnect',
          },
          {
            text: 'WalletDropdownFundLink',
            link: '/wallet/wallet-dropdown-fund-link',
          },
          {
            text: 'WalletDropdownLink',
            link: '/wallet/wallet-dropdown-link',
          },
        ],
      },
    ],
  },
  {
    text: 'API',
    items: [
      {
        text: 'Swap',
        items: [
          {
            text: 'buildSwapTransaction',
            link: '/api/build-swap-transaction',
          },
          {
            text: 'getSwapQuote',
            link: '/api/get-swap-quote',
          },
        ],
      },
      {
        text: 'Token',
        items: [
          {
            text: 'getTokens',
            link: '/api/get-tokens',
          },
        ],
      },
    ],
  },
  {
    text: 'Utilities',
    collapsed: true,
    items: [
      {
        text: 'Config',
        items: [
          {
            text: 'isBase',
            link: '/config/is-base',
          },
        ],
      },
      {
        text: 'Frame',
        items: [
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
            text: 'getXmtpFrameMessage',
            link: '/xmtp/get-xmtp-frame-message',
          },
          {
            text: 'isXmtpFrameRequest',
            link: '/xmtp/is-xmtp-frame-request',
          },
        ],
      },
      {
        text: 'Identity',
        items: [
          {
            text: 'getAddress',
            link: '/identity/get-address',
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
            text: 'getName',
            link: '/identity/get-name',
          },
          {
            text: 'useAddress',
            link: '/identity/use-address',
          },
          {
            text: 'useAvatar',
            link: '/identity/use-avatar',
          },
          {
            text: 'useName',
            link: '/identity/use-name',
          },
        ],
      },
      {
        text: 'Token',
        items: [
          {
            text: 'formatAmount',
            link: '/token/format-amount',
          },
        ],
      },
      {
        text: 'Wallet',
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
    ],
  },
  {
    text: 'Types',
    collapsed: true,
    items: [
      {
        text: 'API',
        link: '/api/types',
      },
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
    ],
  },
] as const satisfies Sidebar;
