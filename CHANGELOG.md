# Changelog

## 0.11.0

### Minor Changes

- d8c3349: - **feat**: 100% unit-test coverage. By @zizzamia #256

## 0.10.2

### Patch Changes

- **fix**: `button.target` is not dependent on `button.action`. By @cnasc #243 d0a2a35

## 0.10.1

### Patch Changes

- **feat**: added `post_url` optional metadata for `tx` Frame. By @zizzamia, @cnasc, @spennyp #237 8028007

Note: this is the version with fully working Frame TX feature.

## 0.10.0

### Minor Changes

- **feat**: Replace internal `useOnchainActionWithCache` with `tanstack/react-query`. This affects `useName` and `useAvatar` hooks. The return type and the input parameters also changed for these 2 hooks. 4090f4f

BREAKING CHANGES

The input parameters as well as return types of `useName` and `useAvatar` hooks have changed. The return type of `useName` and `useAvatar` hooks changed.

### `useName`

Before

```tsx
import { useName } from '@coinbase/onchainkit/identity';

const { ensName, isLoading } = useName('0x1234');
```

After

```tsx
import { useName } from '@coinbase/onchainkit/identity';

// Return type signature is following @tanstack/react-query useQuery hook signature
const {
  data: name,
  isLoading,
  isError,
  error,
  status,
} = useName({ address: '0x1234' }, { enabled: true, cacheTime: 1000 * 60 * 60 * 24 });
```

### `useAvatar`

Before

```tsx
import { useAvatar } from '@coinbase/onchainkit/identity';

const { ensAvatar, isLoading } = useAvatar('vitalik.eth');
```

After

```tsx
import { useAvatar } from '@coinbase/onchainkit/identity';

// Return type signature is following @tanstack/react-query useQuery hook signature
const {
  data: avatar,
  isLoading,
  isError,
  error,
  status,
} = useAvatar({ ensName: 'vitalik.eth' }, { enabled: true, cacheTime: 1000 * 60 * 60 * 24 });
```

## 0.9.12

### Patch Changes

- 7238d29: - **fix**: for `FrameTransactionEthSendParams.data` replaced `Address` with `Hex`. By @zizzamia #224

## 0.9.11

### Patch Changes

- 6763bb2: - **fix**: converted the `value` for `FrameTransactionEthSendParams` to string. By @zizzamia 221

## 0.9.10

### Patch Changes

- 1c94437: - **feat**: added `transactionId` in `FrameData`. By @zizzamia #218

## 0.9.9

### Patch Changes

- 3f76991: - **feat**: added `state` type support for `FrameData` and `FrameValidationData`. By @zizzamia #216
  - **fix**: update Neynar frame validation type. By @Flickque #212

## 0.9.8

### Patch Changes

- 3476d8a: - **feat**: exported `GetEASAttestationsOptions` type, and polished EAS docs. By @zizzamia #210

## 0.9.7

### Patch Changes

- 8a3138c: - **feat**: added `FrameTransactionResponse` and `FrameTransactionEthSendParams` as initial version of Frame Transaction types. By @zizzamia #211
  - **docs**: polished introduction for Frame and Identity pages. By @zizzamia #211

## 0.9.6

### Patch Changes

- 75dc428: - **feat**: added `tx` as a Frame action option, enabling support for Frame Transactions. By @zizzamia #208

## 0.9.5

### Patch Changes

- 4410ad0: - **chore**: added Cross Site Scripting tests for `frame:state`. By @zizzamia #199
  - **feat**: added support for passing `state` to frame server. By @taycaldwell #197

## 0.9.4

### Patch Changes

- **fix**: in EAS did checksum address before querying GQL endpoint. By @dneilroth #182
- **feat**: added support for both ETH and SOL `verified_addresses` for [getFrameMessage](https://onchainkit.xyz/frame/get-frame-message). By @cnasc #181 4c7fe48

## 0.9.3

### Patch Changes

- **fix**: EAS graphql types. By @dneilroth #177 606a717

## 0.9.2

### Patch Changes

- **fix**: `frame` module. By @zizzamia #174 0f7ef77

## 0.9.1

### Patch Changes

- **feat**: created `frame` module. By @zizzamia #172 605ce64

## 0.9.0

### Minor Changes

- **feat**: prep the identity `identity` module. By @zizzamia #171 311b027
- **feat**: added initial version of `getEASAttestations`, which helps getting the user attestations from the Ethereum Attetation Service (EAS). By @alvaroraminelli #126

## 0.8.2

### Patch Changes

- **fix**: make sure imports from `core`, `farcaster` and `xmtp` work. c30296d

## 0.8.1

### Patch Changes

- **feat**: Added `getXmtpFrameMessage` and `isXmtpFrameRequest` so that Frames can receive interactions from apps outside of Farcaster, such as from XMTP conversations. By @neekolas #123 272082b

## 0.8.0

### Minor Changes

- **feat**: `getFrameMessage` can now handle mock frame messages. When `allowFramegear` is passed as an option (defaults to `false`), it will skip validating which facilitates testing locally running apps with future releases of `framegear`. By @cnasc #149 ee72476

## 0.7.0

### Minor Changes

- **feat**: Updated `FrameMetadataType` to support `target` for button `post` and `post_redirect` actions. By @HashWarlock @zizzamia #130 #136 26f6fd5

Note:
In this release we update the `FrameMetadataType` so that it supports the latest [Handling Clicks](https://docs.farcaster.xyz/reference/frames/spec#handling-clicks) Frames specification.

If the button clicked is a `post` or `post_redirect`, apps must:

1. Construct a Frame Signature Packet.
2. POST the packet to `fc:frame:button:$idx:target` if present
3. POST the packet to `fc:frame:post_url if target` was not present.
4. POST the packet to or the frame's embed URL if neither target nor action were present.
5. Wait at least 5 seconds for a response from the frame server.

## 0.6.2

### Patch Changes

- **docs**: Init https://onchainkit.xyz . By @zizzamia #131 926bc30
- **feat**: Added `getFarcasterUserAddress` utility to extract the user's custody and/or verified addresses. By @Sneh1999 #114 #121
- **feat**: Updates the version of `@types/jest` package. By @Sneh1999 #114

## 0.6.1

### Patch Changes

- **feat**: automated the `og:image` and `og:title` properties for `getFrameHtmlResponse` and `FrameMetadata`. By @zizzamia #109 c5ee76d

## 0.6.0

### Minor Changes

- **feat**: better treeshaking support by using **packemon**. By @zizzamia & @wespickett #105 fc74af1

BREAKING CHANGES

For modern apps that utilize `ES2020` or the latest version, breaking changes are not anticipated. However, if you encounter any building issues when using OnchainKit with older apps that rely on `ES6`, please open an issue and provide details of the error you're experiencing. We will do our best to provide the necessary support.

## 0.5.4

### Patch Changes

- **feat**: exported `FrameButtonMetadata`, `FrameInputMetadata` and `FrameImageMetadata` types. By @zizzamia #111 bf014fd
- **feat**: introduced support for image aspect ratio metadata, ensuring backward compatibility. Image metadata can now be defined either as a string (with a default aspect ratio of `1.91:1`) or as an object with a src URL string and an aspect ratio of either `1.91:1` or `1:1`. By @taycaldwell #110

## 0.5.3

### Patch Changes

- **feat**: all `FrameMetadataType` parameters have been updated to use consistent lowerCamelCase. It's important to note that we are not deprecating the old method, at least for a few weeks, to allow time for migration to the new approach. By @zizzamia #106 f2cf7b6
- **feat**: while there is no real issue in using either `property` or `name` as the standard for a metadata element, it is fair to respect the Open Graph specification, which originally uses `property`. By @zizzamia #106

## 0.5.2

### Patch Changes

- **fix**: `<FrameMetadata>` component when used with Helmet. To ensure smooth functionality when used with Helmet as a wrapper component, it is crucial to flatten the Buttons loop. By @zizzamia #99 cefcfa8
- **feat**: added `Avatar` component, to our Identity Kit. The `Avatar` component primarily focuses on showcasing ENS avatar for given Ethereum addresses, and defaults to a default SVG avatar when an ENS avatar isn't available. By @alvaroraminelli #69

## 0.5.1

### Patch Changes

- **feat**: added option for mint action on a Frame. By @zizzamia #93 f9f7652
- **feat**: added option for simple static links when creating a Frame. By @zizzamia #93
- **feat**: added `wrapper` prop to `<FrameMetadata />` component, that defaults to `React.Fragment` when not passed (original behavior). By @syntag #90 #91
- **feat**: exported `FrameMetadataResponse` type which can be useful when using `getFrameMetadata` in a TS project. By @syntag #90

## 0.5.0

### Minor Changes

- **fix**: ensured that the `<FrameMetadata>` component uses the `name` property instead of the `property` property to set the type of metadata. Both options are technically correct, but historically, using `name` is more accurate. dc6f33d
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
