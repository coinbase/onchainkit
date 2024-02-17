---
outline: deep
---

# Frame Kit 🖼️

A Frame transforms any cast into an interactive app.

Creating a frame is easy: select an image and add clickable buttons. When a button is clicked, you receive a callback and can send another image with more buttons. To learn more, check out "[Farcaster Frames Official Documentation](https://warpcast.notion.site/Farcaster-Frames-4bd47fe97dc74a42a48d3a234636d8c5)".

Utilities:

- [getFrameAccountAddress()](https://github.com/coinbase/onchainkit?tab=readme-ov-file#getframeaccountaddress)
- [getFrameMessage()](https://github.com/coinbase/onchainkit?tab=readme-ov-file#getFrameMessage)
- [getFrameMetadata()](https://github.com/coinbase/onchainkit?tab=readme-ov-file#getFrameMetadata)

<br />

### getFrameAccountAddress(message, options)

When a user interacts with your Frame, you will receive a JSON message called the "Frame Signature Packet." Once you validate this `message`, you can extract the Account Address by using the `getFrameAccountAddress(message)` function.

This Account Address can then be utilized for subsequent operations, enhancing the personalized experience of each individual using the Frame.

Note: To utilize this function, we rely on [Neynar APIs](https://docs.neynar.com/reference/user-bulk). In order to avoid rate limiting, please ensure that you have your own API KEY. Sign up [here](https://neynar.com).

```ts
// Steps 1. import getFrameAccountAddress from @coinbase/onchainkit
import { FrameRequest, getFrameAccountAddress, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress = '';
  // Step 2. Read the body from the Next Request
  const body: FrameRequest = await req.json();
  // Step 3. Validate the message
  const { isValid, message } = await getFrameMessage(body);

  // Step 4. Determine the experience based on the validity of the message
  if (isValid) {
    // Step 5. Get from the message the Account Address of the user using the Frame
    accountAddress = await getFrameAccountAddress(message, { NEYNAR_API_KEY: 'NEYNAR_API_DOCS' });
  } else {
    // sorry, the message is not valid and it will be undefined
  }

  ...
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
```

**@Param**

- `message`: The validated message from the Frame
- `options`:
  - `NEYNAR_API_KEY`: The NEYNAR_API_KEY used to access [Neynar Farcaster Indexer](https://docs.neynar.com/reference/user-bulk)

**@Returns**

```ts
type AccountAddressResponse = Promise<string | undefined>;
```

<br />

### getFrameMessage()

When a user interacts with your Frame, you receive a JSON message called the "Frame Signature Packet". Decode and validate this message using the `getFrameMessage` function.

It returns undefined if the message is not valid.

```ts
// Steps 1. import getFrameMessage from @coinbase/onchainkit
import { getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // Step 2. Read the body from the Next Request
  const body = await req.json();
  // Step 3. Validate the message
  const { isValid, message } = await getFrameMessage(body);

  // Step 4. Determine the experience based on the validity of the message
  if (isValid) {
    // the message is valid
  } else {
    // sorry, the message is not valid and it will be undefined
  }

  ...
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
```

**@Param**

- `body`: The Frame Signature Packet body

**@Returns**

```ts
type Promise<FrameValidationResponse>;

type FrameValidationResponse =
  | { isValid: true; message: FrameData }
  | { isValid: false; message: undefined };

interface FrameData {
  fid: number;
  url: string;
  messageHash: string;
  timestamp: number;
  network: number;
  buttonIndex: number;
  castId: {
    fid: number;
    hash: string;
  };
}
```

<br />

### getFrameMetadata(metadata: FrameMetadata)

With Next.js App routing, use the `getFrameMetadata()` inside your `page.ts` to get the metadata need it for your Frame.

```ts
// Steps 1. import getFrameMetadata from @coinbase/onchainkit
import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import HomePage from './home';

// Step 2. Use getFrameMetadata to shape your Frame metadata
const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'We love BOAT',
    },
  ],
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

**@Param**

```ts
type ButtonMetadata = {
  label: string;
  action?: 'post' | 'post_redirect';
};

type ImageMetadata = {
  src: string;
  aspectRatio?: '1.91:1' | '1:1';
};

type FrameMetadata = {
  // A list of strings which are the label for the buttons in the frame (max 4 buttons).
  buttons: [ButtonMetadata, ...ButtonMetadata[]];
  // An image which must be smaller than 10MB and should have an aspect ratio of 1.91:1
  image: string | ImageMetadata;
  // A valid POST URL to send the Signature Packet to.
  post_url: string;
  // A period in seconds at which the app should expect the image to update.
  refresh_period?: number;
};
```

**@Returns**

```ts
type FrameMetadataResponse = Record<string, string>;
```
