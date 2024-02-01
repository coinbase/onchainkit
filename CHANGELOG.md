# Changelog

## 0.3.1

### Patch Changes

- **feat**: introducing `getFrameHtmlResponse` server-side helper method: generates HTML response with valid Frame, uses `FrameMetadata` types for page metadata, eliminates manual creation of server-side HTML strings. 5d80499
- **feat**: the `FrameMetadata` type have been updated. Now, `buttons` and `post_url` are considered optional, aligning with the [Farcaster Frames API](https://warpcast.notion.site/Farcaster-Frames-4bd47fe97dc74a42a48d3a234636d8c5).
- **feat**: going forward, we will utilize `NEYNAR_ONCHAIN_KIT` as the default free API key for [Neynar](https://neynar.com/).

## 0.3.0

### Minor Changes

- **feat** have `getFrameAccountAddress` reading from the message instead of the body. By @zizzamia #46 0695eb9

- **feat** update `getFrameMetadata` to the latest [Frame APIs](https://warpcast.com/v/0x24295a0a) By @zizzamia #43

BREAKING CHANGES

**getFrameAccountAddress**
We have enhanced the `getFrameAccountAddress` method by making it more composable with `getFrameMessage`. Now, instead of directly retrieving the `accountAddress` from the `body`, you will utilize the validated `message` to do so.

Before

```ts
import { getFrameAccountAddress } from '@coinbase/onchainkit';

...

const accountAddress = await getFrameAccountAddress(body);
```

After

```ts
import { getFrameAccountAddress } from '@coinbase/onchainkit';

...
const { isValid, message } = await getFrameMessage(body);
const accountAddress = await getFrameAccountAddress(message);
```

**getFrameMetadata**
We have improved the `getFrameMetadata` method by making the `buttons` extensible for new actions.

Before

```ts
import { getFrameMetadata } from '@coinbase/onchainkit';

...
const frameMetadata = getFrameMetadata({
  buttons: ['boat'],
  image: 'https://build-onchain-apps.vercel.app/release/v-0-17.png',
  post_url: 'https://build-onchain-apps.vercel.app/api/frame',
});
```

```ts
type FrameMetadata = {
  buttons: string[];
  image: string;
  post_url: string;
};
```

After

```ts
import { frameMetadata } from '@coinbase/onchainkit';

...
const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'We love BOAT',
    },
  ],
  image: 'https://build-onchain-apps.vercel.app/release/v-0-17.png',
  post_url: 'https://build-onchain-apps.vercel.app/api/frame',
});
```

```ts
type Button = {
  label: string;
  action?: 'post' | 'post_redirect';
};

type FrameMetadata = {
  // A list of strings which are the label for the buttons in the frame (max 4 buttons).
  buttons: [Button, ...Button[]];
  // An image which must be smaller than 10MB and should have an aspect ratio of 1.91:1
  image: string;
  // A valid POST URL to send the Signature Packet to.
  post_url: string;
  // A period in seconds at which the app should expect the image to update.
  refresh_period?: number;
};
```

## 0.2.1

### Patch Changes

- **feat**: exported `FrameRequest` and `FrameData` types.
- **docs**: Polished README for `getFrameMessage()`. By @zizzamia #38 218b65e
- **fix**: Refactor Farcaster typing to be explicit, and added a Farcaster message verification integration test. By @robpolak @cnasc @zizzamia #37
- **feat**: Added a concept of integration tests where we can assert the actual values coming back from `neynar`. We decoupled these from unit tests as we should not commingle. By @robpolak #35
- **feat**: Refactored `neynar` client out of the `./src/core` code-path, for better composability and testability. By @robpolak #35

BREAKING CHANGES

We made the `getFrameValidatedMessage` method more type-safe and renamed it to `getFrameMessage`.

Before

```ts
import { getFrameValidatedMessage } from '@coinbase/onchainkit';

...

const validatedMessage = await getFrameValidatedMessage(body);
```

**@Returns**

```ts
type Promise<Message | undefined>
```

After

```ts
import { getFrameMessage } from '@coinbase/onchainkit';

...

const { isValid, message } = await getFrameMessage(body);
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

## 0.1.6

### Patch Changes

- **feat**: added initial version of `getFrameValidatedMessage`, which helps decode and validate a Frame message. d5de4e7

## 0.1.5

### Patch Changes

- **fix**: build d042114

## 0.1.4

### Patch Changes

- **feat**: added initial version of `getFrameAccountAddress`, which helps getting the Account Address from the Farcaster ID using the Frame. 398933b

## 0.1.3

### Patch Changes

- **feat**: renamed `generateFrameNextMetadata` to `getFrameMetadata` c015b3e

## 0.1.2

### Patch Changes

- **docs**: kickoff docs for `generateFrameNextMetadata` core utility 30666be
- **fix**: set correctly the `main` and `types` file in the `package.json`

## 0.1.1

### Patch Changes

- **feat**: added `generateFrameNextMetadata` to help generates the metadata for a Farcaster Frame. a83b0f9

## 0.1.0

### Minor Changes

- **feat**: init (e44929f)
