# [OnchainKit](https://github.com/coinbase/onchainkit/)

> OnchainKit is a collection of CSS, React components and Core utilities specifically crafted to enhance your creativity when building onchain applications.

## Getting Started

Add OnchainKit to your project, install the required packages.

```bash
# Use Yarn
yarn add @coinbase/onchainkit

# Use NPM
npm install @coinbase/onchainkit

# Use PNPM
pnpm add @coinbase/onchainkit
```

<br />

## FrameKit 🖼️

### getFrameMetadata()

With Next.js App routing, use the `getFrameMetadata` inside your `page.ts` to get the metadata need it for your Frame.

```ts
// Steps 1. import generateFrameNextMetadata from @coinbase/onchainkit
import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import HomePage from './home';

// Step 2. Use generateFrameNextMetadata to shape your Frame metadata
const frameMetadata = getFrameMetadata({
  buttons: ['boat'],
  image: 'https://build-onchain-apps.vercel.app/release/v-0-17.png',
  post_url: 'https://build-onchain-apps.vercel.app/api/frame',
});

// Step 3. Add your metadata in the Next.js metadata utility
export const metadata: Metadata = {
  manifest: '/manifest.json',
  other: {
    ...frameMetadata
  },
};

export default function Page() {
  return <HomePage />;
}
```

`getFrameMetadata` params

- `buttons`: A list of strings which are the label for the buttons in the frame (max 4 buttons).
- `image`: An image which must be smaller than 10MB and should have an aspect ratio of 1.91:1
- `post_url`: A valid POST URL to send the Signature Packet to.
