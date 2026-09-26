# Mini-App Manifest Generator

React components and utilities to help you generate and manage Farcaster Mini-App manifests.

## 🚀 Quickstart

Run `npx create-onchain --mini` to bootstrap a new Farcaster Mini-App with manifest generation included.

or `npx create-onchain --manifest` from your project directory to generate a new manifest.

## ✨ Documentation

For documentation and guides, visit [www.base.org/builders/minikit](https://www.base.org/builders/minikit).

## ✨ Features

- Generate Mini-App manifests with a simple UI
- Connect with your Farcaster custody account
- Sign and save your manifest to `.env`
- Automatic domain validation
- Built-in TypeScript support

## 🛠️ Development

### Requirements

- Node.js v18
- pnpm v10

### Getting Started

1. Install dependencies
```bash
pnpm install
```

2. Start the development server
```bash
pnpm dev
```

3. Build for production
```bash
pnpm build
```

### Testing

Run the test suite:
```bash
pnpm test
```

Run tests with coverage:
```bash
pnpm test:coverage
```

## 📖 Usage

1. Connect your Farcaster custody wallet
2. Enter your Mini-App domain
3. Sign to generate your manifest
4. Your manifest will be saved to your `.env` file as:
   - `FARCASTER_HEADER`
   - `FARCASTER_PAYLOAD`
   - `FARCASTER_SIGNATURE`

## 🌊 License

This project is licensed under the MIT License - see the [LICENSE.md](../../LICENSE.md) file for details
