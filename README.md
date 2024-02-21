<p align="center">
  <a href="https://onchainkit.xyz">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./site/docs/public/logo/v0-8.png">
      <img alt="OnchainKit logo vibes" src="./site/docs/public/logo/v0-8.png" width="auto">
    </picture>
  </a>
</p>

# OnchainKit

<p align="left">
  React components and TypeScript utilities for top-tier onchain apps.
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
  <a href="https://bundlephobia.com/result?p=@coinbase/onchainkit" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://flat.badgen.net/bundlephobia/minzip/@coinbase/onchainkit">
      <img width="146" height="20" src="https://flat.badgen.net/bundlephobia/minzip/@coinbase/onchainkit" alt="Minified + gzip package size for @coinbase/onchainkit in KB" class="badge--in-table"></a>
    </picture>
  </a>
</p>

<br />

## Documentation

For documentation and guides, visit [onchainkit.xyz](https://onchainkit.xyz/).

## Features

OnchainKit offers three themes packed with React components and TypeScript utilities ready for action.

- [Farcaster Kit](https://onchainkit.xyz/farcasterkit/introduction)
  - Utilities:
    - [`getFarcasterUserAddress`](https://onchainkit.xyz/farcasterkit/get-farcaster-user-address)
- [Frame Kit](https://onchainkit.xyz/framekit/introduction)

  - Components:
    - [`<FrameMetadata />`](https://onchainkit.xyz/framekit/frame-metadata)
  - Utilities:
    - [`getFrameHtmlResponse`](https://onchainkit.xyz/framekit/get-frame-html-response)
    - [`getFrameMessage`](https://onchainkit.xyz/framekit/get-frame-message)
    - [`getFrameMetadata`](https://onchainkit.xyz/framekit/get-frame-metadata)
  - [Framegear](https://onchainkit.xyz/framekit/framegear)

- [Identity Kit](https://onchainkit.xyz/identitykit/introduction)

  - Components:
    - [`<Avatar />`](https://onchainkit.xyz/identitykit/avatar)
    - [`<Name />`](https://onchainkit.xyz/identitykit/name)
  - Utilities:
    - [`getXmtpFrameMessage`](https://onchainkit.xyz/identitykit/get-eas-attestations)

- [XMTP Kit](https://onchainkit.xyz/xmtpkit/introduction)
  - Utilities:
    - [`getXmtpFrameMessage`](https://onchainkit.xyz/xmtpkit/get-xmtp-frame-message)

## Overview

To integrate OnchainKit into your project, begin by installing the necessary packages.

```bash
# Yarn: Add library
yarn add @coinbase/onchainkit
# Yarn: Depending on the components or utilities you choose,
# you may end up utilizing any of those libraries.
yarn add viem@2.x react@18 react-dom@18 graphql@14 graphql-request@6

# or

# Use NPM
npm install @coinbase/onchainkit
npm install viem@2.x react@18 react-dom@18 graphql@14 graphql-request@6

# Use PNPM
pnpm add @coinbase/onchainkit
npm install viem@2.x react@18 react-dom@18 graphql@14 graphql-request@6
```

Then, feel free to utilize any of the components or utilities, such as `FrameMetadata`.

```tsx
import { FrameMetadata } from '@coinbase/onchainkit';

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

## Community ☁️ 🌁 ☁️

Check out the following places for more OnchainKit-related content:

- Follow @zizzamia ([X](https://twitter.com/zizzamia), [Farcaster](https://warpcast.com/zizzamia)) for project updates
- Join the discussions on our [OnchainKit warpcast channel](https://warpcast.com/~/channel/onchainkit)

## Authors

- [@zizzamia](https://github.com/zizzamia) ([X](https://twitter.com/Zizzamia))
- [@cnasc](https://github.com/cnasc) ([warpcast](https://warpcast.com/cnasc))
- [@alvaroraminelli](https://github.com/alvaroraminelli) ([X](https://twitter.com/alvaroraminelli))
- [@robpolak](https://github.com/robpolak) ([X](https://twitter.com/0xr0b_eth))
- [@taycaldwell](https://github.com/taycaldwell) ([X](https://twitter.com/taycaldwell_))
- [@wespickett](https://github.com/wespickett) ([X](https://twitter.com/wespickett))
- [@mochikuan](https://github.com/mochikuan) ([X](https://twitter.com/mochikuan))

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
