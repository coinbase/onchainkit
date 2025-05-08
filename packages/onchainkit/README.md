<div align="center">
  <p>
    <a href="https://onchainkit.xyz">
      <img src="https://github.com/user-attachments/assets/1b2c40bc-3a39-441d-9f5a-43ba286c5ad6" width="100%" height="100%" alt="OnchainKit logo vibes"/>
    </a>
  </p>

  <h1 style="font-size: 3em; margin-bottom: 20px;">
    OnchainKit
  </h1>

  <p style="font-size: 1.2em; max-width: 600px; margin: 0 auto 20px;">
    React components and TypeScript utilities to help you build top-tier onchain apps.
  </p>

<p>
  <a href="https://www.npmjs.com/package/@coinbase/onchainkit" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/npm/v/@coinbase/onchainkit?style=flat-square&color=0052FF" alt="Version" />
  </a>
  <a href="https://github.com/coinbase/onchainkit/commits/main">
    <img src="https://img.shields.io/github/last-commit/coinbase/onchainkit?color=0052FF&style=flat-square" alt="last update" />
  </a>
  <a href="https://www.npmjs.com/package/@coinbase/onchainkit" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/npm/dm/@coinbase/onchainkit?style=flat-square&color=0052FF" alt="Downloads per month" />
  </a>
  <a href="https://onchainkit.xyz/coverage">
    <img src="https://img.shields.io/badge/coverage-100%25-0052FF?style=flat-square" alt="Code coverage" />
  </a>
  <a href="https://github.com/coinbase/onchainkit/blob/main/LICENSE.md" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/npm/l/@coinbase/onchainkit?style=flat-square&color=0052FF" alt="MIT License" />
  </a>
</p>

<p>
  <a href="https://x.com/OnchainKit">
    <img src="https://img.shields.io/twitter/follow/OnchainKit.svg?style=social" alt="Follow @OnchainKit" />
  </a>
  <a href="https://discord.gg/invite/cdp">
      <img src="https://img.shields.io/badge/Chat%20on-Discord-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Chat on Discord" />
  </a>
  <a href="https://github.com/coinbase/onchainkit/stargazers">
    <img src="https://img.shields.io/github/stars/coinbase/onchainkit" alt="stars" />
  </a>
  <a href="https://github.com/coinbase/onchainkit/network/members">
    <img src="https://img.shields.io/github/forks/coinbase/onchainkit" alt="forks" />
  </a>
</p>
</div>

<br />

## 🚀 Quickstart

Run `npm create onchain` to bootstrap an example onchain app with all the batteries included.

## ✨ Documentation

For documentation and guides, visit [onchainkit.xyz](https://onchainkit.xyz/).

## 🛠️ Contributing

### Overview

This project is set up as a monorepo with pnpm workspaces.

### Requirements

- Node.js v18
- pnpm v10

### Getting Started

1. Clone the repository

```bash
git clone https://github.com/coinbase/onchainkit.git
```

2. Install dependencies

```bash
pnpm install
```

### Running packages

To run a script in a single package, use the following command:

```bash
pnpm [-F | --filter] <package-name> <script-name>
```

To run a script in all packages, use the following command:

```bash
pnpm run <script-name>
```

### Shorthands

We provide shorthands to filter by project in the root `package.json`.

The following shorthands are available:

- `pnpm f:ock`: `pnpm --filter @coinbase/onchainkit`
- `pnpm f:play`: `pnpm --filter playground`
- `pnpm f:create`: `pnpm --filter create-onchain`
- `pnpm f:manifest`: `pnpm --filter miniapp-manifest-generator`

### Development

When working on components, you can build OnchainKit in watch mode and start the playground to view your components with the following command:

```bash
pnpm f:play dev:watch
```

Then, you can view the playground at [http://localhost:3000](http://localhost:3000).


## 🌁 Team and Community

- **OnchainKit** ([X](https://x.com/Onchainkit), [Warpcast](https://warpcast.com/onchainkit))
- [Tina He](https://github.com/fakepixels) ([X](https://x.com/fkpxls))
- [Mind Apivessa](https://github.com/mindapivessa) ([X](https://x.com/spicypaprika_))
- [Alissa Crane](https://github.com/abcrane123) ([X](https://x.com/abcrane123))
- [Alec Chen](https://github.com/0xAlec) ([X](https://x.com/0xAlec))
- [Paul Cramer](https://github.com/cpcramer) ([X](https://x.com/PaulCramer_))
- [Shelley Lai](https://github.com/0xchiaroscuro) ([X](https://x.com/hey_shells), [Warpcast](https://warpcast.com/chiaroscuro))
- [Léo Galley](https://github.com/kirkas) ([X](https://x.com/artefact_lad))
- [Adam Lessey](https://github.com/alessey) ([X](https://x.com/alessey))

## 💫 Contributors

<a href="https://github.com/coinbase/onchainkit/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=coinbase/onchainkit" />
</a>

## 🌊 License

This project is licensed under the MIT License - see the [LICENSE.md](../../LICENSE.md) file for details
