<p align="center">
  <a href="https://github.com/coinbase/onchainkit">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./docs/logo-v-0-4.png">
      <img alt="OnchainKit logo vibes" src="./docs/logo-v-0-4.png" width="auto">
    </picture>
  </a>
</p>

# OnchainKit

<p align="left">
  OnchainKit is a collection of tools to build world-class onchain apps with CSS, React, and Typescript.
<p>

<p align="left">
  <a href="https://www.npmjs.com/package/@coinbase/onchainkit">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/@coinbase/onchainkit?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/npm/v/viem?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="Version">
    </picture>
  </a>
  <a href="https://github.com/coinbase/onchainkit/blob/main/LICENSE.md">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/l/@coinbase/onchainkit?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/npm/l/@coinbase/onchainkit?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="MIT License">
    </picture>
  </a>
  <a href="https://www.npmjs.com/package/@coinbase/onchainkit">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/dm/@coinbase/onchainkit?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/npm/dm/@coinbase/onchainkit?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="Downloads per month">
    </picture>
  </a>
</p>

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

OnchainKit is divided into various theme utilities and components that are available for your use:

- [Frame Kit 🖼️](https://github.com/coinbase/onchainkit?tab=readme-ov-file#frame-kit-%EF%B8%8F)
- [Identity Kit 👨‍🚀](https://github.com/coinbase/onchainkit?tab=readme-ov-file#identity-kit-)

<br />
<br />

## Frame Kit 🖼️

A Frame transforms any cast into an interactive app.

Creating a frame is easy: select an image and add clickable buttons. When a button is clicked, you receive a callback and can send another image with more buttons. To learn more, check out "[Farcaster Frames Official Documentation](https://docs.farcaster.xyz/learn/what-is-farcaster/frames)".

**React component**:

- `<FrameMetadata />`: This component renders all the Frame metadata elements in one place.

**Typescript utilities**:

- [`getFrameHtmlResponse()`](https://github.com/coinbase/onchainkit?tab=readme-ov-file#getframehtmlresponseframemetadata): Retrieves the **Frame HTML** for your HTTP responses.
- [`getFrameMessage()`](https://github.com/coinbase/onchainkit?tab=readme-ov-file#getframemessageframerequest): Retrieves a valid **Frame message** from the Frame Signature Packet.
- [`getFrameMetadata()`](https://github.com/coinbase/onchainkit?tab=readme-ov-file#getframeframemetadata): Retrieves valid **Frame metadata** for your initial HTML page with Next.js App Routing.

<br />

### `<FrameMetadata />`

This component is utilized for incorporating Frame metadata elements into the React page.

Note: If you are using Next.js with App routing, it is recommended to use `getFrameMetadata` instead.

```tsx
export default function HomePage() {
  return (
    ...
    <FrameMetadata
      image="https://example.com/image.png"
      post_url="https://example.com"
      buttons={[{ label: 'button1' }]}
    />
    ...
  );
}
```

**@Props**

```ts
type Button = {
  label: string;
  action?: 'post' | 'post_redirect';
};

type InputMetadata = {
  text: string;
};

type FrameMetadataType = {
  // A list of strings which are the label for the buttons in the frame (max 4 buttons).
  buttons?: [Button, ...Button[]];
  // An image which must be smaller than 10MB and should have an aspect ratio of 1.91:1
  image: string;
  // The text input to use for the Frame.
  input?: InputMetadata;
  // A valid POST URL to send the Signature Packet to.
  post_url?: string;
  // A period in seconds at which the app should expect the image to update.
  refresh_period?: number;
};
```

<br />

### getFrameHtmlResponse(frameMetadata)

When you need to send an HTML Frame Response, the `getFrameHtmlResponse` method is here to assist you.

It generates a valid HTML string response with a frame and utilizes `FrameMetadata` types for page metadata. This eliminates the need to manually create server-side HTML strings.

```ts
// Step 1. import getFrameHtmlResponse from @coinbase/onchainkit
import { getFrameHtmlResponse } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // Step 2. Build your Frame logic
  ...

  return new NextResponse(
    // Step 3. Use getFrameHtmlResponse to create a Frame response
    getFrameHtmlResponse({
      buttons: [
        {
          label: `We love BOAT`,
        },
      ],
      image:'https://build-onchain-apps.vercel.app/release/v-0-17.png',
      post_url: 'https://build-onchain-apps.vercel.app/api/frame',
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}
```

**@Param**

```ts
type Button = {
  label: string;
  action?: 'post' | 'post_redirect';
};

type InputMetadata = {
  text: string;
};

type FrameMetadataType = {
  // A list of strings which are the label for the buttons in the frame (max 4 buttons).
  buttons?: [Button, ...Button[]];
  // An image which must be smaller than 10MB and should have an aspect ratio of 1.91:1
  image: string;
  // The text input to use for the Frame.
  input?: InputMetadata;
  // A valid POST URL to send the Signature Packet to.
  post_url?: string;
  // A period in seconds at which the app should expect the image to update.
  refresh_period?: number;
};
```

**@Returns**

```ts
type FrameHTMLResponse = string;
```

<br />

### getFrameMessage(frameRequest)

When a user interacts with your Frame, you receive a JSON message called the "Frame Signature Packet". Decode and validate this message using the `getFrameMessage` function.

You can also use `getFrameMessage` to access useful information such as:

- button: number
- fid: number
- following: boolean
- liked: boolean
- recasted: boolean
- verified_accounts: string[]

Note that if the `message` is not valid, it will be undefined.

```ts
// Step 1. import getFrameMessage from @coinbase/onchainkit
import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  // Step 2. Read the body from the Next Request
  const body: FrameRequest = await req.json();
  // Step 3. Validate the message
  const { isValid, message } = await getFrameMessage(body , {
    neynarApiKey: 'NEYNAR_ONCHAIN_KIT'
  });

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
```

**@Param**

```ts
// The Frame Signature Packet body
type FrameMessage = {
  body: FrameRequest;
  messageOptions?: FrameMessageOptions;
};

type FrameMessageOptions =
  | {
      // The API key to use for validation. Default: NEYNAR_ONCHAIN_KIT
      neynarApiKey?: string;
      // Whether to cast the reaction context. Default: true
      castReactionContext?: boolean;
      // Whether to follow the context. Default: true
      followContext?: boolean;
    }
  | undefined;
```

**@Returns**

```ts
type Promise<FrameValidationResponse>;

type FrameValidationResponse =
  | { isValid: true; message: FrameValidationData }
  | { isValid: false; message: undefined };

interface FrameValidationData {
  button: number; // Number of the button clicked
  following: boolean; // Indicates if the viewer clicking the frame follows the cast author
  input: string; // Text input from the viewer typing in the frame
  interactor: {
    fid: number; // Viewer Farcaster ID
    custody_address: string; // Viewer custody address
    verified_accounts: string[]; // Viewer account addresses
  };
  liked: boolean; // Indicates if the viewer clicking the frame liked the cast
  raw: NeynarFrameValidationInternalModel;
  recasted: boolean; // Indicates if the viewer clicking the frame recasted the cast
  valid: boolean; // Indicates if the frame is valid
}
```

<br />

### getFrameMetadata(frameMetadata)

With Next.js App routing, use the `getFrameMetadata()` inside your `page.ts` to get the metadata need it for your Frame.

```ts
// Step 1. import getFrameMetadata from @coinbase/onchainkit
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

type InputMetadata = {
  text: string;
};

type FrameMetadataType = {
  // A list of strings which are the label for the buttons in the frame (max 4 buttons).
  buttons?: [Button, ...Button[]];
  // An image which must be smaller than 10MB and should have an aspect ratio of 1.91:1
  image: string;
  // The text input to use for the Frame.
  input?: InputMetadata;
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

## Identity Kit 👨‍🚀

### OnchainName

The `OnchainName` component is used to display ENS names associated with Ethereum addresses. When an ENS name is not available, it defaults to showing a truncated version of the address.

```tsx
import { OnchainName } from '@coinbase/onchainkit';

<OnchainName address="0x1234567890abcdef1234567890abcdef12345678" sliced={false} />;
```

**@Props**

```ts
type UseOnchainName = {
  // Ethereum address to be resolved from ENS.
  address: Address;
  // Optional CSS class for custom styling.
  className?: string;
  // Determines if the address should be sliced when no ENS name is available.
  sliced?: boolean;
  // Additional HTML attributes for the span element.
  props?: React.HTMLAttributes<HTMLSpanElement>;
};
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
    </tr>
    <tr>
      <td align="center" valign="top">
        <a href="https://warpcast.com/cnasc">
          <img width="80" height="80" src="https://github.com/cnasc.png?s=100">
        </a>
        <br />
        <a href="https://warpcast.com/cnasc">Chris Nascone</a>
      </td>
      <td align="center" valign="top">
        <a href="https://twitter.com/taycaldwell_">
          <img width="80" height="80" src="https://github.com/taycaldwell.png?s=100">
        </a>
        <br />
        <a href="https://twitter.com/taycaldwell_">Taylor Caldwell</a>
      </td>
    </tr>
  </tbody>
</table>

<br>

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
