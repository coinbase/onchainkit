<img src='./docs/logo-v-0-3.png' width='800' alt='OnchainKit'>

# [OnchainKit](https://github.com/coinbase/onchainkit/)

> OnchainKit is a collection of tools to build world-class onchain apps with CSS, React, and Typescript.

## Getting Started

Add OnchainKit to your project, install the required packages.

<br />

```bash
# Use Yarn
yarn add @coinbase/onchainkit

# Use NPM
npm install @coinbase/onchainkit

# Use PNPM
pnpm add @coinbase/onchainkit
```

<br />
<br />

## FrameKit 🖼️

A Frame transforms any cast into an interactive app.

Creating a frame is easy: select an image and add clickable buttons. When a button is clicked, you receive a callback and can send another image with more buttons. To learn more, check out "[Farcaster Frames Official Documentation](https://warpcast.notion.site/Farcaster-Frames-4bd47fe97dc74a42a48d3a234636d8c5)".

Utilities:

- [getFrameAccountAddress()](https://github.com/coinbase/onchainkit?tab=readme-ov-file#getframeaccountaddress): Retrieves the user **Account Address** from a Frame message.
- [getFrameHtmlResponse()](https://github.com/coinbase/onchainkit?tab=readme-ov-file#getframehtmlresponse): Retrieves the **Frame HTML** for your HTTP responses.
- [getFrameMessage()](https://github.com/coinbase/onchainkit?tab=readme-ov-file#getframemessage): Retrieves a valid **Frame message** from the Frame Signature Packet.
- [getFrameMetadata()](https://github.com/coinbase/onchainkit?tab=readme-ov-file#getframemetadata): Retrieves valid **Frame metadata** for your initial HTML page.

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
    accountAddress = await getFrameAccountAddress(message, { NEYNAR_API_KEY: 'NEYNAR_ONCHAIN_KIT' });
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

```ts
type AccountAddressRequest = {
  // The validated message from the getFrameMessage() function
  message: FrameData;
  options: {
    // The NEYNAR_API_KEY used to access Neynar Farcaster Indexer
    // https://docs.neynar.com/reference/user-bulk
    NEYNAR_API_KEY: string;
  };
};
```

**@Returns**

```ts
type AccountAddressResponse = Promise<string | undefined>;
```

<br />

### getFrameHtmlResponse(options)

Coming soon docs!

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

```ts
type FrameMessageRequest = {
  // The Frame Signature Packet body
  body: FrameRequest;
};
```

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
type Button = {
  label: string;
  action?: 'post' | 'post_redirect';
};

type FrameMetadata = {
  // A list of strings which are the label for the buttons in the frame (max 4 buttons).
  buttons?: [Button, ...Button[]];
  // An image which must be smaller than 10MB and should have an aspect ratio of 1.91:1
  image: string;
  // A valid POST URL to send the Signature Packet to.
  post_url?: string;
  // A period in seconds at which the app should expect the image to update.
  refresh_period?: number;
};
```

**@Returns**

```ts
type FrameMetadataResponse = Record<string, string>;
```

<br />
<br />

## The Team and Our Community ☁️ 🌁 ☁️

OnchainKit is all about community; for any questions, feel free to:

1. Reach out to the core maintainers on Twitter or Farcaster
<table>
  <tbody>
    <tr>
      <td align="center" valign="top">
        <a href="https://twitter.com/Zizzamia">
          <img width="80" height="80" src="https://github.com/zizzamia.png?s=100">
        </a>
        <br />
        <a href="https://twitter.com/Zizzamia">Leonardo Zizzamia</a>
      </td>
      <td align="center" valign="top">
        <a href="https://twitter.com/0xr0b_eth">
          <img width="80" height="80" src="https://github.com/robpolak.png?s=100">
        </a>
        <br />
        <a href="https://twitter.com/0xr0b_eth">Rob Polak</a>
      </td>
      <td align="center" valign="top">
        <a href="https://twitter.com/alvaroraminelli">
          <img width="80" height="80" src="https://github.com/alvaroraminelli.png?s=100">
        </a>
        <br />
        <a href="https://twitter.com/alvaroraminelli">Alvaro Raminelli</a>
      </td>
      <td align="center" valign="top">
        <a href="https://warpcast.com/cnasc">
          <img width="80" height="80" src="https://github.com/cnasc.png?s=100">
        </a>
        <br />
        <a href="https://warpcast.com/cnasc">Chris Nascone</a>
      </td>
    </tr>
  </tbody>
</table>

<br>

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
