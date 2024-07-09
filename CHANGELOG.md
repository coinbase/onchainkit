# Changelog

## 0.24.4

### Patch Changes

- c5ca26d: - **docs**: Add isSliced option to the Address component. This allows this component to render the full users address when set to false. Remove the isSliced field from the Name component and update the component to return null if the ENS name is not found for the given address. Update onchainkit dependency to version 0.24.3. Add sub sections to the Address and Name pages. By @cpcramer #733

## 0.24.3

### Patch Changes

- 8124f8c: - **feat**: added `isSliced` option to the `Address` component. This allows this component to render the full users address when set to false. Update `getName` and the `Name` component to return `null` if the ENS name is not found for the given address. By @cpcramer #737

  Breaking Changes

  - Update `getName` and the `Name` component to return `null` if the ENS name is not found for the given address.

## 0.24.2

### Patch Changes

- **feat**: init `Transaction` components. By @zizzamia #763 4a37815

## 0.24.1

### Patch Changes

- **feat**: exported `SwapToggleButtonReact`, `WalletDropdownDisconnectReact` and `WalletDropdownLinkReact` types. Added more custom option to `WalletDropdownLink` component. By @zizzamia #754 5959b49

## 0.24.0

### Minor Changes

- **chore**: Swap components internal refactor. By @kyhyco #746 d638dc9

Breaking Changes

- `ConnectAccount` has been removed from `Wallet` module.
- `ConnectWallet`'s `label` prop renamed to `text`.
- Update `getName` and the `Name` component to return `null` if the ENS name is not found for the given address.

## 0.23.4

### Patch Changes

- **feat**: add className to ConnectWallet and WalletDropdown components. By @kyhyco #737 6a3fde5

## 0.23.3

### Patch Changes

- **docs**: Update Swap docs to include className override changes. Add new override example and image in the Swap page. By @cpcramer #722 19a7f6f
- **feat**: add hasCopyAddressOnClick to Identity component. By @kyhyco #730 #734 72f287b
- **feat**: add EthBalance component to identity. By @kyhyco #729
- **feat**: add ConnectWallet component. By @kyhyco #720 #728

## 0.23.2

### Patch Changes

- **chore**: Remove unsupported fields from the Coinbase Wallet Provider. appChainIds and options. By @cpcramer #717 f98d4bf
- **docs**: Update Token Type docs with new className parameter. By @cpcramer #716 cc7cf73
- **feat**: Add Swap Kit component className override. By: @cpcramer #719 e6a2d77

## 0.23.1

### Patch Changes

- **fix**: revert peer dependancy PRs. f4fcd2a

## 0.22.3

### Patch Changes

- **docs**: Update Swap component docs. Update wagmi import from sendTransaction to useSendTransaction. Add EthToken and USDCToken parameters. By @cpcramer #694 6ce8682
- **docs**: Update getting started guide. Add OnchainProviders.tsx file name. Add code focus for the newly added OnchainProviders.tsx code in the ConfigureWagmiProvider step. By @cpcramer #692 a16c5ed
- **fix**: Avatar component now handles className override correctly. By @kyhyco #697 1ad6c98

## 0.22.2

### Patch Changes

- **fix**: revert "use client". By @kyhyco #690 ad7cd60

## 0.22.1

### Patch Changes

- **feat**: Identity polish. By @kyhyco #675 b834572
  - add `fill` theme
  - update `Name` component default font color
  - add `className` prop to `Identity`
  - add `className` prop to `Badge` and remove styling props
  - add `className` prop to `Avatar`
  - fix using `address` prop on `Avatar` and `Name` component along with `Identity`
  - remove `showAddress` from `getName`
- **feat**: add `use client` directives components. By @roushou #668 #669 #670 #655 #667
- **docs**: force doc site to connect to base. By @kyhyco #613 1f8fcb1
- **chore**: Add test coverage and comments. By @abcrane123 #676 2198bed
- **feat**: Add "everything you need to build onchain" section to the landing page. By @cpcramer #679 097df0d
- **docs**: Update docs with SwapMessage info. By @abcrane123 #662 d4fdc77
- **chore**: Refactor balance api calls into reusable hooks. By @abcrane123 #673 a1b87f6
- **chore**: Update the landing page View Docs button styling, title description, and href link behavior to always open in a new tab. By @cpcramer #660 0e9bd1b
- **chore**: Update swap messages and reset error states. By @abcrane123 #677 72138fe

## 0.22.0

### Minor Changes

- **feat**: refactor Identity components and add Address component. By @kyhyco #641 0903bf7

Breaking Changes

- `showAddress` has been removed from `Name` component.
- `showAttestion` has been removed from `Name` and `Avatar` components. Add `Badge` in `Name` or `Avatar` children to render attestations.

Features

- `Address` component handles rendering account address.
- `Address` component can be passed into `Identity` component
- Similar to `Name` component, `address` prop can be assigned to `Address` or `Identity` component

## 0.21.9

### Patch Changes

- **docs**: fix ui regression on index.mdx. By @cpcramer #661 78d38b0
- **feat**: added background, pressable and color themes. By @kyhyco #642
- **docs**: updated Tailwind integration guide. By @kyhyco #636
- **feat**: updated `SwapMessage` component to display error and loading states. By @abcrane123 #611

## 0.21.8

### Patch Changes

- **feat**: update `lib` to `esm` for exported files. By @kyhyco #653 eb19002
- **feat**: init Wallet component. By @zizzamia #654

## 0.21.7

### Patch Changes

- **feat**: added loading state and spinner to `SwapButton`. By @abcrane123 #633 ac33e28

## 0.21.6

### Patch Changes

- **feat**: add className override to all Text components. By @kyhyco #640 4387f14
- **fix**: revert "chore: upgrade packemon to v4". By @zizzamia #646

## 0.21.5

### Patch Changes

- **chore**: upgrade packemon to v4 and going forward support ESM only. By @kyhyco #616 4b762a1
- **feat**: enable geo blocking for restricted territories. By @cpcramer #614

## 0.21.4

### Patch Changes

- **feat**: added theming to all `Text` components. By @kyhyco #632 bf26c81
- **feat**: refactored balance api calls and add swap quote loading state. By @abcrane123 #630

## 0.21.3

### Patch Changes

- **feat**: added badge feature to `Identity` component. By @zizzamia #627 8c873f1

## 0.21.2

### Patch Changes

- **fix**: `Identity` matching `Name` component. By @zizzamia #624 425f4fd

## 0.21.1

### Patch Changes

- **feat**: added `Name` to `Identity`. By @zizzamia #622 0c9fdc9

## 0.21.0

### Minor Changes

- **feat**: intro `Identity` component. By @zizzamia #620 5c7f076

## 0.20.16

### Patch Changes

- **feat**: added title prop to Swap component. By @kyhyco #615 693e145
- **fix**: handled edge case for Swap Balance. By @abcrane123 #612
- **docs**: updated doc site to 0.20.15 and include Swap component variations. By @kyhyco #609
- **feat**: disabled `SwapButton` in docs and removed `onSubmit`. by @0xAlec #608

## 0.20.15

### Patch Changes

- **fix**: remove onError prop from Swap components. By @kyhyco #602 356fe39
- **feat**: docs for `buildSwapTransaction` + cleanup. By @0xAlec #605 9eed9b5
- **feat**: add optional disable prop to SwapButton. By @abcrane123 #604 3d71b4a
- **fix**: error message from an unset api key. By @0xAlec #600 2adbe4f

## 0.20.14

### Patch Changes

- **feat**: simplified `Transaction` type in `Swap` experience. By @zizzamia #598 cb44eba
- **feat**: init `SwapMessage` component. By @zizzamia #596

## 0.20.13

### Patch Changes

- **feat**: added `delayMs` optional prop to `SwapAmountInput`. By @zizzamia #594 d26378f
- **docs**: config update. By @kyhyco #586

## 0.20.12

### Patch Changes

- **fix**: `SwapAmountInput` now correctly displays text styles. By @kyhyco #581 fb26571

## 0.20.11

### Patch Changes

- **fix**: fix `TokenSelectButton` hit detection. By @kyhyco #577 8aff0e8

## 0.20.10

### Patch Changes

- **feat**: added DM Sans. By @kyhyco #574 199c00f
- **featt**: added Balance info in `Swap` components. By @abcrane123 #558
- **feat**: added `SwapToggleButton`. By @kyhyco #572

## 0.20.9

### Patch Changes

- **fix**: fix get quote logic in `Swap` component. By @kyhyco #568 5479818

## 0.20.8

### Patch Changes

- **fix**: swap `Token` pair mode. By @kyhyco #566 5347ea9
- **feat**: added input delay to `SwapAmountInput`. By @kyhyco #563
- **feat**: addeded swappable tokens to `SwapAmountInput`. By @abcrane123 #561
- **fix**: updated Smart Wallet util. By @lukasrosario #564
- **chore**: updated `isWalletASmartWallet` name to be `isWalletACoinbaseSmartWallet`. We want to explicitly state that this is checking for Coinbase Smart Wallets. By @cpcramer #562
- **feat**: enableded linting in CI. By @zizzamia #559

## 0.20.7

### Patch Changes

- **fix**: fix `Identity` components lint errors. By @kyhyco #555 1cd548a
- **fix**: fix `Token` component lint errors. By @kyhyco #554
- **feat**: updated `Swap` style. By @kyhyco #553
- **feat**: refactored and clean up internals. By @zizzamia #552
- **feat**: introduce `Inter` font-family and internal text components. By @kyhyco #506

## 0.20.6

### Patch Changes

- **fix**: added Token amount formatter. By @abcrane123 #543 #544 0225039
- **chore**: more code cleanup. By @zizzamia #536 #537

## 0.20.5

### Patch Changes

- **fix**: `Swap` type. By @zizzamia #532 5a8cd45

## 0.20.4

### Patch Changes

- **feat**: exported `Swap` components. By @zizzamia #530 5cab65c

## 0.20.2

### Patch Changes

- **feat**: added `Swap` component. By @abcrane123 & @kyhyco #522 9fef5e9

## 0.20.1

### Patch Changes

- **feat**: added `buildSwapTransaction`. By @0xAlec & @zizzamia #503 #518 ccb069e
- **fix**: added tailwind utilities to exported styles.css. By @kyhyco #515

## 0.20.0

### Minor Changes

- **feat**: set `clsx`, `tailwind-merge`, `viem` and `wagmi` as library dependency. By @zizzamia #512 39e4715
- **feat**: removd `TokenSelector` components and add refactored `TokenSelectDropdown`. By @kyhyco #508
- **feat**: added `SwapAmountInput`. By @abcrane123 #504
- **feat**: refactor CSS styles with a proper use of TailwindCSS. By @roushou #500

## 0.19.7

### Patch Changes

- **fix**: have API_KEY set correctly by `OnchainKitProvider` and avoid request CORS issue with the `onchainkit_version` Header. By @zizzamia #501 a47b07f

## 0.19.6

### Patch Changes

- **fix**: added border transparent to Badge component. By @zizzamia #493 c54ec7b

## 0.19.5

### Patch Changes

- **chore**: continue migrating to Tailwind for CSS internals. By @zizzamia #492 477e1f5
- **fix**: reduce gap between `TokenSelector` and `TokenSelectorDropdown`. By @kyhyco #489
- **docs**: add back `TokenSelectorDropdown` example. By @kyhyco #487

## 0.19.4

### Patch Changes

- **feat**: updated TokenKit styles. By @kyhyco #482 10d1fa9

## 0.19.3

### Patch Changes

- **feat**: added `getQuote`. by @0xAlec #479 fdab188
- **feat**: deprecated `LegacyTokenData`. By @0xAlec #478
- **feat**: added `TokenSelectorDropdown` to use with `TokenSelector`. By @kyhyco #475

## 0.19.2

### Patch Changes

- **feat**: converted `Badge` to css. By @zizzamia #476 9b03393
- **feat**: converted `TokenRow` to css, add modifier state and add additinal display controls. By @kyhyco #473

## 0.19.1

### Patch Changes

- **feat**: for `getAvatar` now we use `ensName` instead of `name`. By @zizzamia #471 b6653f1

## 0.19.0

### Minor Changes

- **feat**: standardized `getAvatar()`. By @roushou #464 029ba7d

- **feat**: `TokenImage` with no image renders partial token symbol and deterministic dark color. By @kyhyco#468
- **feat**: converted `TokeSearch` to css and add modifier styles. By @kyhyco #460
- **docs**: added contribution guide. By @kyhyco #459

Breaking changes

- Changed the definition of `getAvatar(...)`, from `getAvatar(ensName: string)` to `getAvatar(params: {ensName: string })`.
- Changed `TokenImage` props from

```ts
export type TokenImageReact = {
  src: string | null;
  size?: number;
};
```

to

```ts
export type TokenImageReact = {
  token: Token;
  size?: number;
};
```

## 0.18.6

### Patch Changes

- **feat**: postcss integration + add modifier states TokenChip css. By @kyhyco #453 db2e1d9

## 0.18.5

### Patch Changes

- **feat**: added the `isWalletASmartWallet` utility which helps verify if a given sender address is a Smart Wallet proxy with the expected implementation before sponsoring a transaction. By @cpcramer & @zizzamia #420 #454 dd31024

## 0.18.4

### Patch Changes

- **fix**: style.css location. By @zizzamia 62be36a

## 0.18.3

### Patch Changes

- **fix**: style.css location. By @zizzamia #445 81ea439

## 0.18.2

### Patch Changes

- **fix**: moved `styles.css` at top level. By @zizzamia #443 afc7d2d

## 0.18.1

### Patch Changes

- **feat**: added taildwindcss. By @kyhyco #441 0c6420a
- **feat**: added `TokenImage` to render token image. By @kyhyco #438
- **feat**: added `TokenSelector`, a button component to render token info or placeholder text. By @kyhyco #438

## 0.18.0

### Minor Changes

- **feat**: TokenKit first version is ready to be used. By @zizzamia 361d5c6

## 0.17.11

### Patch Changes

- **chore**: revert TokenChip.css. By @kyhyco #426 fe340d7

## 0.17.10

### Patch Changes

- **feat**: add TokenSearch component that allows users to search on a given list of tokens by name, symbol and address. By @kyhyco #421 0f14362

## 0.17.9

### Patch Changes

- **feat**: added `onchainkit_version` header to API requests. By @zizzamia #423 04cda00
- **feat**: updated the `FrameTransactionResponse` type to accommodate an `eth_personalSign` method needed for XMTP consent proofs. By @daria-github #413
- **docs**: update GetTokens to include capability to search by address. By @kyhyco

## 0.17.8

### Patch Changes

- **chore**: updated `TokenSelector` docs and added `useFilteredTokens` to `TokenSelector`. By @kyhyco #417 9576276
- **feat**: added `TokenSelector` to select a token from a list. By @kyhyco #410 350066e

## 0.17.7

### Patch Changes

- **feat**: added `isValidAAEntrypoint` wallet utility function. By @cpcramer #409 68d5c3d

## 0.17.6

### Patch Changes

- **feat**: Added `isBase` utility function. By @cpcramer #403 66b8309

## 0.17.5

### Patch Changes

- **feat**: added `TokenRow` component to render Token is a row format. By @kyhyco #399 7485234

## 0.17.4

### Patch Changes

- **feat**: added `formatAmount` utility function to assist in formatting token amounts. By @kyhyco #398 0265426

## 0.17.3

### Patch Changes

- **feat**: added `permissionless` as dependency for WalletKit. By @zizzamia #396 bf94ffd

## 0.17.2

### Patch Changes

- **feat**: added `getTokens`, which helps retrieve a list of tokens on Base. By @0xAlec #389 2922e75

## 0.17.1

### Patch Changes

- **feat**: polished `Token` Type. By @zizzamia #386 17a3d06
- **feat**: init `TokenChip` component. By @kyhyco #383
- **feat**: scaffold Swap API request and types. By @0xAlec #381
- **feat**: add CDP api key and rpc url to OnchainKitConfig and OnchainKitProvider. By @0xAlec #379

## 0.17.0

### Minor Changes

- **feat**: added `getOnchainKitConfig` and `setOnchainKitConfig` to access and edit the share OnchainKit config directly. By @zizzamia #376 9498586

Breaking Changes
Removed `getFrameHtmlResponse`, `getFrameMessage`, `getMockFrameRequest` and Frames types from the root level exports. And you can find them going forward in `@coinbase/onchainkit/frame`.

## 0.16.10

### Patch Changes

- **feat**: exported `ConnectAccountReact` type. c4a9f78

## 0.16.9

### Patch Changes

- **fix**: packemon. By @zizzamia 8b56121

## 0.16.1

### Patch Changes

- **feat**: keep polishing the `ConnectAccount` component. By @zizzamia #344 64b59f7

## 0.16.0

### Minor Changes

- **feat**: init `ConnectAccount` component, which will make even easier to use Smart Wallet. By @zizzamia #342 9f93913

Breaking Changes

Transition to exclusively using ESM and phase out CommonJS support.

## 0.15.0

### Minor Changes

- **feat**: renamed anything that says `EASAttestation` to just `Attestation`. This should help better popularize the concept of attestation. By @zizzamia #332 7935116

Breaking Changes

The `getEASAttestations` now is `getAttestations`.

## 0.14.2

### Patch Changes

- **feat**: added missing CSS radius on `Avatar` component. By @zizzamia #329 78319ec

## 0.14.1

### Patch Changes

- **chore**: deprecated root level imports for `getFrameMetadata`, `FrameMetadata`, `Avatar`, `Name`, `useAvatar`, `useName` utilities and components. By @zizzamia a83f9f0

## 0.14.0

### Minor Changes

- **feat**: added `showAddress` as an option to the `Name` component. By @zizzamia #322 249e1ac

Breaking Changes

- The `Name` component will use `showAddress` to override the default ENS behavior, and `getName`. It will have multiple options as input, which means to pass the address you have to do `getName({ address })` instead of `getName(address)`.
- Removed `getFrameMetadata`, `FrameMetadata`, `Avatar`, `Name`, `useAvatar`, `useName` from the root level exports. And you can find them going forward in either `@coinbase/onchainkit/frame` or `@coinbase/onchainkit/identity`.

## 0.13.4

### Patch Changes

- **feat**: exported `BadgeReact` type. By @zizzamia #312 42ae354

## 0.13.3

### Patch Changes

- **feat**: keep polishing the `Badge` component props and how to customize it. By @zizzamia #310 f4e432f

## 0.13.2

### Patch Changes

- **feat**: added custom style to `Badge` component. By @zizzamia #307 7476951

## 0.13.1

### Patch Changes

- **feat**: defined three main props for `OnchainKitProvider`: `address`, `chain` and `schemaId`. By @zizzamia #305 49c4233

## 0.13.0

### Minor Changes

- **feat**: added Ethereum Attestation `Badge` component to the Identity kit. By @kyhyco & @zizzamia #259 #289 75f309c

## 0.12.1

### Patch Changes

- **feat**: added missing `address` and `transaction` field for `FrameValidationData` type. By @zizzamia & @SamuelLHuber #287 d61861f

## 0.12.0

### Minor Changes

- **feat**: init Open Frame spec support. By @zizzamia @daria-github @neekolas #285 b8aa317

## 0.11.3

### Patch Changes

- **feat**: exposed the `getName` and `getAvatar` utilities to assist in retrieving name and avatar identity information. These utilities come in handy when working with Next.js or any Node.js backend. By @zizzamia #265 #283 b795268

## 0.11.2

### Patch Changes

- **feat**: upgraded `@xmtp/frames-validator` package to [0.6.0](https://github.com/xmtp/xmtp-node-js-tools/pull/191). By @zizzamia #278 #277 695b4a0

## 0.11.1

### Patch Changes

- **feat**: include peer dependency for graphql@15 and graphql@16. By @benson-budiman-cb #270 2301e64

## 0.11.0

### Minor Changes

- **feat**: 100% unit-test coverage. By @zizzamia #256 d8c3349

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
