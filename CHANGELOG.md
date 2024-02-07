# Changelog

## 0.5.1

### Patch Changes

- f9f7652: - **feat**: added option for mint action on a Frame. By @zizzamia #93
  - **feat**: added option for simple static links when creating a Frame. By @zizzamia #93
  - **feat**: added `wrapper` prop to `<FrameMetadata />` component, that defaults to `React.Fragment` when not passed (original behavior). By @syntag #90 #91
  - **feat**: exported `FrameMetadataResponse` type which can be useful when using `getFrameMetadata` in a TS project. By @syntag #90

## 0.5.0

### Minor Changes

- dc6f33d: - **fix**: ensured that the `<FrameMetadata>` component uses the `name` property instead of the `property` property to set the type of metadata. Both options are technically correct, but historically, using `name` is more accurate.

  - **feat**: renamed the component from `OnchainName` to `Name` in our Identity Kit. This is a breaking changes. The purpose of the rename is to simplify and enhance clarity. By @alvaroraminelli #86

  BREAKING CHANGES

  To enhance usability and intuitiveness, the component name has been simplified. `OnchainName` is now renamed to `Name`.

  Before

  ```ts
  import { OnchainName } from '@coinbase/onchainkit';

  ...
  <OnchainName address="0x1234">
  ```

  After

  ```ts
  import { Name } from '@coinbase/onchainkit';

  ...
  <Name address="0x1234">
  ```

## 0.4.5

### Patch Changes

- **feat**: exported `FrameMetadataType`. 6f9dd77

## 0.4.4

### Patch Changes

- **fix**: added missing `input` type on `FrameValidationData`. d168475

## 0.4.3

### Patch Changes

- **feat**: added `textInput` to `FrameData`. 4bd8ec8

## 0.4.2

### Patch Changes

- **feat**: added support for Text Input metadata for Farcaster Frames. By @taycaldwell #67 89e5210
- **feat**: added `FrameMetadata` component, to help support metadata elements with classic React apps. By @zizzamia #71
- **feat**: added `OnchainName` component, to our Identity Kit. The `OnchainName` component primarily focuses on showcasing ENS names for given Ethereum addresses, and defaults to displaying a sliced version of the address when an ENS name isn't available. By @alvaroraminelli #49

## 0.4.1

### Minor Changes

- **feat**: the `getFrameAccountAddress` function has been deprecated. Now, the `getFrameMessage` function also returns the Account Address. #60 0355c73
- **feat**: integrated with Neynars API to obtain validated messages and additional context, such as recast, follow-up, etc. By @robpolak #59
- **fix**: removed the Farcaster references due to build errors and compatibility issues. By @robpolak #59

BREAKING CHANGES

We received feedback regarding our initial approach with OnchainKit, which had excessive dependencies on Node.js-only libraries. This caused issues when integrating the library with React Native and the latest version of Node (e.g., v21).

In response to this feedback, we decided to utilize Neynar to simplify our approach and implementation of the `getFrameMessage` method. By incorporating Neynar, you now have no dependencies for that particular method and will also receive additional data to enhance your Frame.

Therefore, as `getFrameMessage` relies on Neynar, it is necessary to provide a Neynar API KEY when using the method in order to avoid rate limiting.

Before

```ts
import { getFrameMessage } from '@coinbase/onchainkit';

...
const { isValid, message} = await getFrameMessage(body);
```

After

```ts
import { getFrameMessage } from '@coinbase/onchainkit';

...
const { isValid, message } = await getFrameMessage(body , {
  neynarApiKey: 'NEYNAR_ONCHAIN_KIT'
});
```

Additionally, the `getFrameMessage` function now returns the Account Address. As a result, we no longer require the use of `getFrameAccountAddress`.

This enhancement allows us to accomplish more with **less** code!

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
- **docs**: polished README for `getFrameMessage()`. By @zizzamia #38 218b65e
- **fix**: refactor Farcaster typing to be explicit, and added a Farcaster message verification integration test. By @robpolak @cnasc @zizzamia #37
- **feat**: added a concept of integration tests where we can assert the actual values coming back from `neynar`. We decoupled these from unit tests as we should not commingle. By @robpolak #35
- **feat**: refactored `neynar` client out of the `./src/core` code-path, for better composability and testability. By @robpolak #35

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
