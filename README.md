<p align="center">
  <a href="https://onchainkit.xyz">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./site/docs/public/logo/v0-29.png">
      <img alt="OnchainKit logo vibes" src="./site/docs/public/logo/v0-29.png" width="auto">
    </picture>
  </a>
</p>

# OnchainKit

<p align="left">
  React components and TypeScript utilities to help you build top-tier onchain apps.
<p>

<p align="left">
  <a href="https://www.npmjs.com/package/@coinbase/onchainkit" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/@coinbase/onchainkit?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/npm/v/@coinbase/onchainkit?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="Version">
    </picture>
  </a>
  <a href="https://github.com/coinbase/onchainkit/blob/main/LICENSE.md" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/l/@coinbase/onchainkit?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/npm/l/@coinbase/onchainkit?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="MIT License">
    </picture>
  </a>
  <a href="https://www.npmjs.com/package/@coinbase/onchainkit" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/dm/@coinbase/onchainkit?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/npm/dm/@coinbase/onchainkit?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="Downloads per month">
    </picture>
  </a>
</p>

<br />

## Documentation

For documentation and guides, visit [onchainkit.xyz](https://onchainkit.xyz/).

## Quickstart

You can use OnchainKit in an existing project, by installing OnchainKit as a dependency.

### Install

Let's install OnchainKit as a dependency along with its dependencies.

```bash
# Yarn: Add library
yarn add @coinbase/onchainkit

# or

# Use NPM
npm install @coinbase/onchainkit

# Use PNPM
pnpm add @coinbase/onchainkit

# Use BUN
bun add @coinbase/onchainkit
```

### Configure the OnchainKitProvider

The `<OnchainKitProvider />` component equips your app with the essential context to interact with OnchainKit components and utilities.

Set the `chain` prop to your target chain and provide the API KEY to access the embedded APIs.

```tsx
'use client';
import { ReactNode } from 'react';
import { base } from 'viem/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';

type Props = { children: ReactNode };

function OnchainProviders({ children }: Props) {
  return (
    <OnchainKitProvider apiKey="YOUR_PUBLIC_API_KEY" chain={base}>
      <YourKit />
    </OnchainKitProvider>
  );
};

export default OnchainProviders;
```

Obtain an API key from the [Coinbase Developer Platform APIs](https://portal.cdp.coinbase.com/products/onchainkit).

<img
  alt="OnchainKit copy API KEY"
  src="https://onchainkit.xyz/assets/copy-api-key-guide.png"
  width="auto"
/>

### Configure the WagmiProvider

Many of OnchainKit's components require a WagmiProvider to access Wagmi utilities.

If your application already includes these settings, you can skip this step.

OnchainProviders.tsx
```tsx
'use client';
import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // [!code focus]
import { base } from 'viem/chains';
import { WagmiProvider } from 'wagmi'; // [!code focus]
import { wagmiConfig } from './wagmi'; // [!code focus]

type Props = { children: ReactNode };

const queryClient = new QueryClient(); // [!code focus]

function OnchainProviders({ children }: Props) {
  return (
    <WagmiProvider config={wagmiConfig}> // [!code focus]
      <QueryClientProvider client={queryClient}> // [!code focus]
        <OnchainKitProvider
          apiKey={YOUR_PUBLIC_API_KEY}
          chain={base}
        >
          {children} // [!code focus]
        </OnchainKitProvider>
      </QueryClientProvider> // [!code focus]
    </WagmiProvider> // [!code focus]
  );
}

export default OnchainProviders;
```

wagmi.ts
```tsx
import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [base],
  multiInjectedProviderDiscovery: false,
  connectors: [
    coinbaseWallet({
      appName: 'yourAppName',
      preference: 'all',
      version: '4',
    }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});
```

### Style your components

All OnchainKit components come pre-configured with a style.

Simply place this at the top of your application's entry point to have the components working out of the box.

```javascript
import '@coinbase/onchainkit/styles.css';
```

For `tailwindcss` users, follow the [Tailwindcss Integration Guide](https://onchainkit.xyz/guides/tailwind).


## Components

#### Display ENS [avatars](https://onchainkit.xyz/identity/avatar), Attestation [badges](https://onchainkit.xyz/identity/badge), ENS [names](https://onchainkit.xyz/identity/name) and account [addresses](https://onchainkit.xyz/identity/address).

```tsx
<Identity
  address="0x838aD0EAE54F99F1926dA7C3b6bFbF617389B4D9"
  schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
>
  <Avatar>
    <Badge />
  </Avatar>
  <Name />
  <Address />
</Identity>
```

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./site/docs/public/assets/onchainkit-identity.png">
  <img alt="OnchainKit Identity components" src="./site/docs/public/assets/onchainkit-identity.png" width="auto">
</picture>

#### Convert your web page into a [Frame](https://onchainkit.xyz/frame/frame-metadata)

```tsx
import { FrameMetadata } from '@coinbase/onchainkit/frame';

export default function HomePage() {
  return (
    ...
    <FrameMetadata
      buttons={[
        {
          label: 'Tell me the story',
        },
        {
          action: 'link',
          label: 'Link to Google',
          target: 'https://www.google.com'
        },
        {
          action: 'post_redirect',
          label: 'Redirect to cute pictures',
        },
      ]}
      image={{
       src: 'https://zizzamia.xyz/park-3.png',
       aspectRatio: '1:1'
      }}
      input={{
        text: 'Tell me a boat story',
      }}
      postUrl="https://zizzamia.xyz/api/frame"
    />
    ...
  );
}
```

#### Create or connect your wallet with [Connect Wallet](https://onchainkit.xyz/wallet/wallet), powered by [Smart Wallet](https://www.smartwallet.dev/why).

```tsx
<Wallet>
  <ConnectWallet>
    <Avatar className="h-6 w-6" />
    <Name />
  </ConnectWallet>
  <WalletDropdown>
    <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
      <Avatar />
      <Name>
        <Badge />
      </Name>
      <Address />
      <EthBalance />
    </Identity>
    <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
      Go to Wallet Dashboard
    </WalletDropdownLink>
    <WalletDropdownDisconnect />
  </WalletDropdown>
</Wallet> 
```

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./site/docs/public/assets/onchainkit-wallet-1.png">
  <img alt="OnchainKit Wallet components" src="./site/docs/public/assets/onchainkit-wallet-1.png" width="auto">
</picture>
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./site/docs/public/assets/onchainkit-wallet-2.png">
  <img alt="OnchainKit Wallet components" src="./site/docs/public/assets/onchainkit-wallet-2.png" width="auto">
</picture>

#### Search [Tokens](https://onchainkit.xyz/token/types#token) using [getTokens](https://onchainkit.xyz/token/get-tokens) and display them with [TokenSearch](https://onchainkit.xyz/token/token-search), [TokenChip](https://onchainkit.xyz/token/token-chip), [TokenImage](https://onchainkit.xyz/token/token-image) and [TokenRow](https://onchainkit.xyz/token/token-row)

```tsx
const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);

const handleChange = useCallback((value) => {
async function getData(value) {
const tokens: Token[] = await getTokens({ search: value }); // [!code focus]
setFilteredTokens(filteredTokens);
}
getData(value);
}, []);
...

<div className="flex flex-col gap-4 rounded-3xl bg-white p-4">
  <TokenSearch onChange={handleChange} delayMs={200} /> // [!code focus]
  {filteredTokens.length > 0 && (
    <div className="flex gap-2">
      {filteredTokens.map((token) => (
        <TokenChip key={token.name} token={token} onClick={handleSelect} /> // [!code focus]
      ))}
    </div>
  )}
  {filteredTokens.length > 0 ? (
    <div>
      <div className="text-body text-black">Tokens</div>
      <div>
        {filteredTokens.map((token) => (
          <TokenRow key={token.name} token={token} onClick={handleSelect} /> // [!code focus]
        ))}
      </div>
    </div>
  ) : (
    <div className="text-body text-black">No tokens found</div>
  )}
</div>
```

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./site/docs/public/assets/onchainkit-token.png">
  <img alt="OnchainKit Wallet components" src="./site/docs/public/assets/onchainkit-token.png" width="auto">
</picture>

## Utilities

If you're seeking basic TypeScript utilities, we have plenty of ready-to-use options available.

##### Config

- [isBase](https://onchainkit.xyz/config/is-base)

##### Frames

- [getFrameHtmlResponse](https://onchainkit.xyz/frame/get-frame-html-response)
- [getFrameMessage](https://onchainkit.xyz/frame/get-frame-message)
- [getFrameMetadata](https://onchainkit.xyz/frame/get-frame-metadata)

##### Identity

- [getAvatar](https://onchainkit.xyz/identity/get-avatar)
- [getAttestations](https://onchainkit.xyz/identity/get-attestations)
- [getName](https://onchainkit.xyz/identity/get-name)
- [useName](https://onchainkit.xyz/identity/use-name)
- [useAvatar](https://onchainkit.xyz/identity/use-avatar)

##### Swap

- [getSwapQuote](https://onchainkit.xyz/swap/get-swap-quote)
- [buildSwapTransaction](https://onchainkit.xyz/swap/build-swap-transaction)

##### Token

- [formatAmount](https://onchainkit.xyz/token/format-amount)
- [getTokens](https://onchainkit.xyz/token/get-tokens)

##### Wallet

- [isValidAAEntrypoint](/wallet/is-valid-aa-entrypoint)
- [isWalletACoinbaseSmartWallet](/wallet/is-wallet-a-coinbase-smart-wallet)

##### Farcaster

- [getFarcasterUserAddress](https://onchainkit.xyz/farcaster/get-farcaster-user-address)

##### XMTP

- [getXmtpFrameMessage](https://onchainkit.xyz/xmtp/get-xmtp-frame-message)
- [isXmtpFrameRequest](https://onchainkit.xyz/xmtp/is-xmtp-frame-request)

## Design

All our component designs are open-sourced. You can access the [Figma file](https://www.figma.com/community/file/1370194397345450683) to use them for your onchain project.

<a href="https://www.figma.com/community/file/1370194397345450683">
  <p>Figma - How to use</p>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./site/docs/public/assets/onchainkit-figma-design-how-to-use.png">
    <img alt="OnchainKit logo vibes" src="./site/docs/public/assets/onchainkit-figma-design-how-to-use.png" width="auto">
  </picture>
  <p>Figma - Components</p>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./site/docs/public/assets/onchainkit-figma-design-components.png">
    <img alt="OnchainKit logo vibes" src="./site/docs/public/assets/onchainkit-figma-design-components.png" width="auto">
  </picture>
</a>

## Onchain App Templates

- [Simple App](https://github.com/coinbase/onchain-app-template)

## Community ☁️ 🌁 ☁️

Check out the following places for more OnchainKit-related content:

- Follow [@onchainkit](https://x.com/Onchainkit) or [@zizzamia](https://github.com/zizzamia) ([X](https://twitter.com/zizzamia), [Warpcast](https://warpcast.com/zizzamia)) for project updates
- Join the discussions on our [OnchainKit warpcast channel](https://warpcast.com/~/channel/onchainkit)

## Authors

- [Leonardo Zizzamia](https://github.com/zizzamia) ([X](https://twitter.com/zizzamia), [Warpcast](https://warpcast.com/zizzamia))
- [Tina He](https://github.com/fakepixels) ([X](https://twitter.com/fkpxls))
- [Shelley Lai](https://github.com/0xchiaroscuro) ([X](https://twitter.com/chiaroscuro), [Warpcast](https://warpcast.com/chiaroscuro))
- [Ky Lee](https://github.com/kyhyco)
- [Mind Apivessa](https://github.com/mindapivessa) ([X](https://twitter.com/spicypaprika_))
- [Alissa Crane](https://github.com/abcrane123) ([X](https://twitter.com/abcrane123))
- [Alec Chen](https://github.com/0xAlec) ([X](https://twitter.com/0xAlec))
- [Paul Cramer](https://github.com/cpcramer) ([X](https://twitter.com/PaulCramer_))
- [Léo Galley](https://github.com/kirkas)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
