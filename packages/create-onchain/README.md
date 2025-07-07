# Create Onchain

A CLI tool to bootstrap your Base onchain apps and Farcaster Mini-Apps with best practices and modern tooling.

## 🚀 Quickstart

Create a new project:
```bash
# Create an Onchainkit template
npx create-onchain

# Create a Mini-App template
npx create-onchain --mini

# Create a particular Mini-App template
npx create-onchain --template-<template>

Available Templates:
  - onchainkit-nextjs: Create a basic OnchainKit project
  - minikit-nextjs: Create a MiniKit project

# Generate a Mini-App manifest in existing project
npx create-onchain --manifest

# Show the available commands
npx create-onchain --help

# Show the current version
npx create-onchain --version
```

## 📦 Templates

### Next.js Basic Template
A Next.js template with OnchainKit pre-configured for building Base onchain apps:
- Next.js 14+ with App Router
- OnchainKit components and hooks
- Wagmi for wallet connection
- Tailwind CSS for styling
- TypeScript support
- ESLint and Prettier configured

```bash
npx create-onchain
# Default template
```

### MiniKit Template
A template optimized for building Farcaster Mini-Apps:
- Next.js 14+ with App Router
- MiniKit components and hooks
- Farcaster Frame utilities
- OnchainKit for Wallet Connection
- OnchainKit for sample Transaction
- Tailwind CSS for styling
- TypeScript support
- ESLint and Prettier configured

```bash
npx create-onchain --mini
# or
npx create-onchain --template=minikit-basic
```

## 🔧 Development

### Requirements
- Node.js v18+
- pnpm v10+

### Getting Started

1. Install dependencies
```bash
pnpm install
```

2. Start development
```bash
pnpm dev
```

3. Build
```bash
pnpm build
```

### Testing
```bash
# Run tests
pnpm test

# Run with coverage
pnpm test:coverage
```

## 📖 Mini-App Manifest Generation

When using `--manifest`, the tool will:
1. Launch a UI to connect your Farcaster custody wallet
2. Generate and sign your manifest
3. Save it to your `.env` file as:
   - `FARCASTER_HEADER`
   - `FARCASTER_PAYLOAD`
   - `FARCASTER_SIGNATURE`

## 🌊 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
