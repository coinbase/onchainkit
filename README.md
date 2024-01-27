# [OnchainKit](https://github.com/coinbase/onchainkit/)

> OnchainKit is a collection of CSS, React components and Core utilities specifically crafted to enhance your creativity when building onchain applications.

## Core utilities

### generateFrameNextMetadata

Next App `page.ts`

```ts
// Steps 1. import generateFrameNextMetadata from @coinbase/onchainkit
import { generateFrameNextMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import HomePage from './home';

// Step 2. Use generateFrameNextMetadata to shape your Frame metadata
const frameMetadata =  generateFrameNextMetadata({
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
