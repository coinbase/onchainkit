# Changelog

## 0.38.8

### Patch Changes

- 7eb0e94: - **feat**: Add batch ENS / Basename resolution with useAddresses hook and getAddresses utility. By @cpcramer #2277
- f41e838: - **chore**: Refactored getNames utility to leverage batch processing with getAddresses. By @cpcramer #2281
- a17d3f7: Prevented video button clicks from propagating and small style fixes
- b1c2361: - **chore**: Add bidirectional resolution validation when batching `Basenames` and `ENS` names. By @cpcramer #000

## 0.38.7

### Patch Changes

- **fix**: Fix AppchainBridge useDeposit hook. By @0xAlec #2262

## 0.38.6

### Patch Changes

- **chore**: Add bidirectional resolution validation to `Basenames` and `ENS` names. By @cpcramer #2255
- **fix**: Wallet unnecessarily fetching tokenBalances. By @alessey #2258
- **feat**: Add uninstalled wallet connector redirects. By @cpcramer #2245

## 0.38.5

### Patch Changes

- **feat**: Enabled Alpha releases for OnchainKit. By @dgca #2201 #2211
- **feat**: Added MiniKit CLI. By @alessey #2183
- **fix**: Removed unused \@coinbase/onchainkit/core export. By @dgca #2211
- **chore**: Updated `ConnectWallet` and added default children. By @abcrane123 #2186

## 0.38.4

### Patch Changes

- **fix**: Fix missing `/dist` folder in package.json. By @dgca #2208

## 0.38.3

### Patch Changes

- **refactor**: Organized coinbase/onchainkit project into pnpm workspace. By @dgca #2167
- **chore**: Added Attestation caching. By @cpcramer #2180
- **feat**: Added `MiniKit` to the playground - https://onchainkit.xyz/playground/minikit. By @alessey #2176
- **feat**: Added Rabby, Trust, and Frame wallet connection support in `WalletModal`. By @cpcramer #2168
- **chore**: Refactored `Wallet`. Deprecated `WalletAdvanced`. By @abcrane123 #2179
- **fix**: `SwapSettings` not rendering for `SwapDefault` component. By @abcrane123 #2200

## 0.38.2

### Patch Changes

- **feat**: Add iconUrl to OnrampPaymentCurrency type. By @rustam-cb #2165
- **fix**: Fix bug that would disable onramp due to USDC price fluctuations. By @abcrane123 #2171
- **chore**: Remove site code from onchainkit repository. By @cpcramer #2136

## 0.38.1

### Patch Changes

- **feat**: Added WalletAdvanced Send. By @brendan-defi #2134
- **fix**: Added accesibility improvements to playground. By @futreall #2150

## 0.38.0

### Minor Changes

- **feat**: Added `Signature` component which utilizes wagmi signTypedData (EIP 712) and signMessage (personal_sign falling back to eth_sign) to sign data. By @alessey #2105
- **feat**: Added light/dark mode support for the Base `theme`. This will respect the `mode` setting in your `OnchainKitProvider` config (defaults to 'auto' if not specified). Users of the Base theme may now see light or dark variants depending on their system preferences or explicit mode configuration. By @cpcramer #2143
- **feat**: Added `Badge` tooltip display. By @cpcramer #2140

  - **feat**: Implemented default children for `NFTCard`, `NFTMintCard`, and `Transaction` components. By @dgca @abcrane123 #2138 #2139 #2108
  - **chore**: Updated `IsBaseOptions` and `IsEthereumOptions` type naming convention to PascalCase. By @crStiv @cpcramer #1920
  - **chore**: Refactored `TokenBalance`'s ActionButton and improved `TokenBalance` types. By @brendan-defi #2068
  - **chore**: Updated `Onramp` utils to allow to be used in non-react JS environments and/or without having to set up Onchainkit Provider. By @rustam-cb #2135
  - **fix**: `TokenRow` text-overflow: ellipsis work correctly. By @dgca #2133

  Breaking Changes:

  - Types `IsBaseOptions` and `IsEthereumOptions` have been updated from camelCase to PascalCase.

## 0.37.8

### Patch Changes

- **feat:**: Enhanced `Identity` hooks with full TanStack Query options support. By @cpcramer #2116
  - **feat:**: Added MiniKit Provider and Hooks. By @alessey #2082, #2101, #2112
  - **fix:**: Fixed WalletDropdownLinkReact type to allow ReactNode in icon property. By @gmolki #2058
  - **feat**: Added event handlers to `Earn` components. @abcrane123 #2106

## 0.37.7

### Patch Changes

- **feat**: Batch support for Basenames and ENS names. By @cpcramer #2102
- **feat**: Added Batch support for Base and Ethereum Avatars. By @cpcramer #2107
- **feat**: Added base mainnet deploychain address. By @0xAlec #2096
- **feat**: Implemented Swap default children. By @alessey #2077
- **fix**: Improved Next.js server env compatibility. By @dschlabach #2090

## 0.37.6

### Patch Changes

- c2d4c67: - **fix**: Updated internal caching, resulting in performance improvements for components such as `Identity`, `Swap`, `Wallet`, and `NFT` components. By @cpcramer #2085
  - **fix**: Moved `<TransactionButton/>` styling to configurable parent. By @alessey #2070
  - **fix**: Updated `Wallet` and `Checkout` component events. By @cpcramer #2061 #2053
  - **feat**: Added API endpoint `getPriceQuote`. By @brendan-defi #2065

## 0.37.5

### Patch Changes

- **fix** updated useOutsideClick to handle portals. fixes issue with WalletAdvancedSwap. by @brendan-defi #2043
- **feat** implemented telemetry for Swap and Buy. by @cpcramer #1964, #1969
- **feat** improved Earn accessibility. by @dschlabach #2045, #2048, #2044
- **feat** added AppchainBridge exports. by @0xAlec #2052

## 0.37.4

### Patch Changes

- **feat**: Added Transaction Telemetry. By @cpcramer #1965
- **chore**: Added origin to analytics. By @cpcramer #2015
- **fix**: Added OnchainKit error boundary. By @alessey #2019
- **feat**: Added NFTMintButton analytics. By @cpcramer #2027
- **feat**: Exposed handleFetchPrice on top-level AppchainBridge component. By @0xAlec #2034
- **feat**: Added success state to AppchainBridge. By @0xAlec #2035
- **feat** added `AppchainBridgeResumeTransaction`. by @0xAlec #2038

## 0.37.3

### Patch Changes

- **fix**: Revert Mint changes that were causing an infinite loop in `NFTMintButton`. By @cpcramer #2031

## 0.37.2

### Patch Changes

- **fix**: Improve chain support for non Base transactions. By @dschlabach #2016
- **docs**: Documentation updates and improvements. By @dschlabach @maximevtush @kilavvy

## 0.37.1

### Patch Changes

- **feat**: Add `Checkout` component telemetry. By @cpcramer #1968
- **feat**: Add `Fund` component telemetry. By @cpcramer #1967
- **feat**: Add `Mint` component telemetry. By @cpcramer #1966
- **feat**: Add `WalletAdvanced` component telemetry. By @cpcramer #1963
- **feat**: Add `ConnectWallet` component telemetry. By @cpcramer #1957
- **docs**: Documentation updates and improvements. By @dschlabach @dramarereg @tomasandroil @maximevtush
- **chore**: `sendAnalytics` improvements. @By @dschlabach #1999
- **feat**: Add `isSponsored` support for the `Earn` component. @dschlabach 1998

## 0.37.0

### Minor Changes

- **feat** Add telemetry to help us better understand library usage and improve the developer experience. @cpcramer

### Patch Changes

- **feat** Add Appchain Bridge UI. by @0xAlec #1976
- **fix** Add various improvements to the Earn component. by @dschlabach #1973
- **docs** Add documentation for the Earn component. by @dschlabach #1974
- **chore** Update earnings token. By @alessey #1985
- **fix** Remove circular dependency. By @dschlabach #1970

  ## Telemetry

  Starting with version 0.37.0, OnchainKit introduces an anonymous telemetry system to help us better understand library usage and improve the developer experience. This system collects anonymous data about:

  - Component usage and events
  - Version and app information
  - Usage metrics
  - Error events

  No sensitive data (environment variables, private keys, file paths) is ever collected.

  ### How to Opt Out

  To fully disable telemetry collection, set the `analytics` flag to `false` in your OnchainKit Provider:

  Learn more at https://onchainkit.xyz/guides/telemetry

## 0.36.11

### Patch Changes

- **docs**: Add Telemetry guide. By @cpcramer #1935
- **feat**: Added Telemetry foundation for `Buy`, `Checkout`, `Fund`, `Mint`, `Swap`, `Transaction`, and `Wallet`. By @cpcramer #1942
- **feat**: Add analytics parameter. When set to false, all telemetry collection will be disabled and no data will be sent. @cpcramer #1934
- **feat**: Release `Earn` component. By @dschlabach #1955
- **chore**: Bump wagmi dependencies. By @dschlabach #1949
- **fix**: Fix slow wallet resolution. By @dschlabach #1947
- **docs**: Update onramp documentation. By @rustam-cb #1945 #1939
- **fix**: Fix onramp util `fetchOnrampQuote`. By @rustam-cb #1940

Note: OnchainKit is not collecting any telemetry as of `v0.36.11`. This will be enabled in a future release.

## 0.36.10

### Patch Changes

- **feat**: Export NFT context. By @alessey #1917
- **feat**: WalletAdvanced mobile design. by @brendan-defi #1827
- **fix**: Await sequential transaction calls. by @dschlabach #1918
- **feat**: Add exchange rate refresh with throttling for FundCard. By @rustam-cb #1900
- **feat**: Dynamic text size in AmountInput component. by @rustam-cb #1909
- **feat**: Add style overrides to WalletAdvanced. by @brendan-defi #1912
- **feat**: Add DropdownMenu UI Primitive. By @cpcramer #1901
- **feat**: Implemented `DropdownMenu` primitive into `TokenSelectDropdown`. By @cpcramer #1903

## 0.36.9

### Patch Changes

- **fix** Fixed typos in documentation. By @rebustron #1850
- **chore**: Deprecated amountReference: 'to' in V1 Swap. By @alessey #1851
- **feat**: Implemented Popover, DismissableLayer, and FocusTrap primitives in SwapSettings. By @cpcramer #1856
- **chore**: Standardized comment format to JSDoc-style syntax'. By @cpcramer #1868
- **feat** Added analytics. By @0xAlec #1869

## 0.36.8

### Patch Changes

- **feat**: Add Popover UI Primitive. By @cpcramer #1849
- **feat**: Added NFT data hooks. By @alessey #1838
- **fix**: Made improvements to FundCard component. By @rustam-cb #1806 #1818 #1839
- **fix**: Made improvements to WalletIsland component. By @brendan-cb #1842
- **fix**: Made internal typesafety and efficiency improvements. By @dschlabach #1855 #1843
- **fix**: Fixed typos in documentation and comments. By @youyyytrok @vipocenka #1840 #1841

## 0.36.7

### Patch Changes

- **feat**: Implemented `FundCard` component by @rustam-cb #1718
- **fix**: Updated client boundaries for `NFT`, `Wallet*`, and `WalletAdvanced*` components by @dschlabach #1809, #1810, #1821

## 0.36.6

### Patch Changes

- **fix**: Fixed ConnectWallet handler bug by @brendan-defi #1814

## 0.36.5

### Patch Changes

- **chore**: Removed Jest config files. By @cpcramer #1811
- **docs**: Added Troubleshooting section. By @cpcramer #1803
- **fix**: Updated NFT Mint Button for easier styling. By @alessey #1807
- **fix**: Updated wallet modal to pass through app name and logo. By @alessey #1808
- **fix**: Improved support for nextjs. By @dschlabach #1771
- **feat**: Added advanced wallet options with draggable WalletIsland component. By @brendan-defi #1793

## 0.36.4

### Patch Changes

- **feat**: Add Phantom Wallet connection support in `WalletModal`. By @cpcramer #1770
- **docs**: Fixed typos in docs. By @mdqst @MarsonKotovi4 @zeevick10 @Pricstas #1774 #1784 #1788 #1791

## 0.36.3

### Patch Changes

- **feat**: Added disabled prop to Buy component. @abcrane123 #1775

## 0.36.2

### Patch Changes

- **docs**: Added auto logged in components on landing page. @cpcramer #1754
- **feat**: Added Buy component. By @abcrane123. #1729
- **fix**: Added support for React 19. By @dschlabach #1763
- **fix**: Fixed Tailwind config. By @dschlabach #1750
- **docs**: Made docs improvements. By @mdqst @0xwitty @cpcramer #1761 #1762 #1765
- **feat**: Added `headerLeftContent` prop to `Swap` component. By @brennancabell #1752

## 0.36.1

### Patch Changes

- **docs**: Updated `Identity` component preview. By @cpcramer #1717
- **docs**: Updated `WalletModal` image size. By @cpcramer #1723
- **chore**: Added animation to landing page. By @mindapivessa #1682
- **dev**: Fixed test file type errors and set dev aliases. By @dschlabach @alessey #1720
- **chore**: Updated WalletModal UI. By @cpcramer #1727
- **feat**: Added tailwindcss-animate. By @alessey #1734
- **fix**: Fixed onramp listener function bug. By @abcrane123 #1728
- **docs**: Fixed typos in docs & README.md. By @Guayaba221 @vtjl10 @omahs @famouswizard @Olexandr88 @mdqst @dschlabach @detrina @Danyylka #1711 #1735 #1736 #1737 #1739 #1745 #1746 #1747 #1743 #1741
- **feat**: Added SwapLite util functions. By @abcrane123 #1648
- **refactor**: Migrated NFT components to new file structure. By @alessey #1714
- **chore**: Renamed SwapLite utils to Buy utils. By @abcrane123 #1742
- **feat**: Added QrCode component. By @brendan-defi #1731
- **refactor**: Moved web utils to ui/react/internal/utils. By @dschlabach #1716
- **feat**: Added Draggable component. By @brendan-defi #1730
- **fix**: Fixed development alias. By @alessey #1749
- **docs**: Remove redundant header in wallet docs. By @fakepixels #1678
- **fix**: Fixed storybook. By @alessey #1753

## 0.36.0

### Minor Changes

- **feat**: Improved funding flow in `Checkout` by @0xAlec #1692
- **chore**: Added `useOutsideClick` hook. By @cpcramer #1612
- **chore**: Theme styling improvements. By @brendan-defi #1676
- **fix**: Fixed `TokenDropdown` when parent container is larger than button. By @dschlabach #1667
- **chore**: Removed `Farcaster Frames`. Deprecating `Framegear`, `Frames`, `XMTP`, and `Neynar` support. By @cpcramer #1693
- **feat**: Updated `WalletModal` to support MetaMask wallet connection. By @cpcramer #1701
- **fix**: Fixed changelog generation. By @dschlabach #1680
- **docs**: Documentation updates and improvements. By @brendan-defi @0xAlec @dschlabach #1690 #1685

Breaking Changes:

- `Farcaster Frames` including `Framegear`, `Frames`, `XMTP`, and `Neynar` is no longer supported.

## 0.35.8

### Patch Changes

- **docs**: Add `WalletModal` docs. @fakepixels @cpcramer #1671 #1669

## 0.35.7

### Patch Changes

- **feat**: Add `WalletModal` component. By @cpcramer #1610
- **docs**: Update `Transaction` docs for heterogeneous calls. By @abcrane123 #1560

## 0.35.6

### Patch Changes

- **feat**: Add linking functionality to playground. By @dschlabach #1624
- **feat**: Upgraded viem to support heterogeneous calls. By @abcrane123 #1527
- **feat**: Added default WagmiProvider and QueryClientProvider if not provided in the React context. By @OxAlec #1589
- **feat**: Added global Toast component. By @brendan-defi #1588

## 0.35.5

### Patch Changes

- **fix**: Updated `NFTCard` and `NFTMintCard` to be more responsive. By @alessey #1590
- **fix**: Updated `NFTCard` and `NFTMintCard` styles to use gap enabling simpler composition. By @alessey #1594
- **docs**: Added `NFTCard` and `NFTMintCard` to the docs. By @alessey #1572
- **docs**: Fixed typos in docs. By @steveviselli-cb @cypherpepe #1593 #1587
- **docs**: Added `NFTCardDefault` and `NFTMintCardDefault` to the docs. By @alessey #1592
- **fix**: Fixed misconfigured `.env` file in `create-onchain` CLI. By @dschlabach #1595
- **docs**: Added `"use client"` directive to instructions for Next.js. By @dschlabach #1596

## 0.35.4

### Patch Changes

-**chore**: Updated `OnchainKitProvider` to fallback to CB verified schemaID. By @cpcramer #1575 -**chore**: Updated `hasCopyAddressOnClick` functionality to specify `Address` component. By @cpcramer #1547 -**docs**: Updated documentation. @dschlabach @fakepixels #1555 #1567 -**docs**: Added installation steps for `Astro`, `Nextjs`, `Remix`, and `Vite`. @brendan-defi #1546 -**feat**: Added hot-loading for playground development. @dschlabach #1551 -**feat**: Added `NFTCard`, `NFTCardDefault`, `NFTMintCard`, and `NFTMintCardDefault` components. @alessey #1580 #1483 #1490

## 0.35.3

### Patch Changes

- **feat**: Added `onConnect` handler to `<ConnectWallet />`. By @dschlabach #1529
- **feat**: Added `NFTCard` and `NFTMintCard` components. By @alessey #1409
- **fix**: Added media square prop, default to true. By @alessey #1548
- **fix**: Updated Transaction link for smart wallets. by @abcrane123 #1550
- **fix**: Updated Warpcast Socials link and SVG. By @cpcramer #1542
- **fix**: Updated badge checkmark styling. By @cpcramer #1537
- **fix**: Updated `hasCopyAddressOnClick`. By @cpcramer #1547

## 0.35.2

### Patch Changes

- d84e29d: -**feat**: Added `IdentityCard` and `Socials` components. By @cpcramer #1489 -**fix**: Added `isSponsored` prop to components. By @abcrane123 #1499 -**fix**: Enforce base as chain for name resolution for Basenames. By @kirkas #1517

## 0.35.1

### Patch Changes

- **feat**: Added ability to customize error and success states for `TransactionButton`. By @abcrane123 #1460
- **feat**: Added custom `Theming` support. By @cpcramer #1465
- **feat**: added `name` and `logo` to `OnchainKitProvider`. by @0xAlec #1506
- **fix**: Added callback support to the `Transaction` component. By @alessy #1473
- **docs**: Updated documentation. By @0xAlec @dschlabach @fakepixels @cpcramer #1465 #1470 #1477 #1478 #1486 #1487 #1490
- **feat**: Updated playground with `Checkout` component and custom `Theming`. @0xAlec @cpcramer #1428 #1465
- **feat**: Updated landing page. @mindapivessa #1482 #1496
- **fix**: clear error message in CheckoutStatus if a request is denied. by @0xAlec #1510

## 0.35.0

### Minor Changes

- **feat**: Add handling for calls and contracts promises in Transactions component. By @alessey #1450
- **feat**: added presetCryptoAmount param to Checkout. by @0xAlec #1461
- **chore** renamed `Pay` module to `Checkout`. by @0xAlec #1455
- **fix**: fixed paymaster sponsorship prop `isSponsored` in `Checkout` component. by @0xAlec #1458
- **fix**: Updated `ConnectWalletText` component styling to match the `ConnectWallet` text prop formatting. By @cpcramer #1445

Breaking Changes:
`Pay` has been renamed to `Checkout`. If you are using this component, please update your imports as necessary.

## 0.34.1

### Patch Changes

- **chore**: Update missing address error handling in the `Identity` components. By @cpcramer #1430
- **feat**: Added formatting for scientific notation for Swap amounts. by @0xAlec #1423
- **feat**: Added `paymaster` field to OnchainKitConfig. by @0xAlec #1425
- **feat** Added `isSponsored` to `Pay` component. by 0xAlec #1427
- **feat**: Added `Pay` component theming support. By @cpcramer #1431
- **fix**: Added browser window check in usePreferredColorScheme to fix server side errors. By @cpcramer #1424

## 0.34.0

### Minor Changes

- **feat**: Added `Theming` support. By @cpcramer #1354
- **docs**: Added `Pay` component docs. By @0xAlec #1400

Breaking Changes

- Added a new config parameter to the `OnchainKitProvider`. The config object includes an appearance property with optional `mode` and `theme` parameters, allowing you to customize the appearance of your components.
- Updated CSS variables to use the `ock` prefix (e.g., `--ock-bg-default`). We’ve also introduced many new variables to enhance theming customization.
- For detailed information and theming instructions, refer to the `Theming Guide` in the documentation.

## 0.33.6

### Patch Changes

-**chore**: Updated documentation, including support for `copy to clipboard` functionality in code blocks. By @alessey @fakepixels #1342 -**chore**: Reset state in `Pay` component after `Get USDC` is clicked. By @0xAlec #1394

## 0.33.5

### Patch Changes

-**fix**: Removed circular dependency for WalletDefault. By @abcrane123 #1378

## 0.33.4

### Patch Changes

- **feat**: Added SwapDefault component which renders suggested implementation of Swap. By @abcrane123 #1303
- **feat**: Added WalletDefault component which renders suggested implementation of Wallet. By @abcrane123 #1302
- **feat**: Added TransactionDefault component which renders suggested implementation of Transaction. By @abcrane123 #1350
- **feat**: Added [Pay] component. by @0xAlec #1349

## 0.33.3

### Patch Changes

- **feat**: Implemented the fund button integrated with Coinbase Onramp. By @steveviselli-cb #1322

## 0.33.2

### Patch Changes

- **feat**: integrated Coinbase Onramp into `WalletDropdownFundLink` for funding EOA wallets. By @steveviselli-cb #1285

## 0.33.1

### Patch Changes

- **feat**: added Swap USD values. By @cpcramer #1286
- **feat**: added `SwapToast` component that renders on success. By @abcrane123 #1281
- **feat**: added `isSponsored` prop for `Swap`. By @0xAlec #1293

## 0.33.0

### Minor Changes

- **feat**: set v2 as default API for Swap. by @0xAlec #1254
- **chore**: updated `SwapSettingsSlippageInput` to use the input config defaultMaxSlippage value. By @cpcramer #1263
- **feat**: added batched Swap transactions from ERC-20. by @0xAlec #1272

Breaking Changes

Updated `LifecycleStatus` in `Swap` component for swaps from ERC-20 tokens.
Previously, there were 2 transactions when swapping from an ERC-20 token.
Now, there is an extra approval. (Approve ERC-20 against Permit2 -> Approve Uniswap to spend the approved ERC-20s on Permit2 -> Execute Swap Transaction)
Additionally, for Coinbase Smart Wallet users, transaction calls are now batched so only one `transactionApproved` lifecycle status will be emitted under the `Batched` transaction type for swaps from ERC-20s.
If you're listening to the `LifecycleStatus` in `Swap`, please make sure your app accounts for the extra transaction.

## 0.32.0

### Minor Changes

- 7e18c98: - **feat**: re-typed walletCapabilities object in `OnchainKitConfig`. By @0xAlec #1238

  - **fix**: removed `mt-4` from `<TransactionButton>`, ensuring the primary component maintains a clean and consistent design without outer margin. By @zizzamia #1258
  - **fix**: renamed LifeCycle to Lifecycle. By @zizzamia #1257
  - **fix**: `SwapSlippageInput` was visually resetting to default value on error. By @cpcramer #1250
  - **fix**: removed context states and use `lifecyclestatus` as the source of truth, also persisted all lifecycle status data (except errors). By @alessey #1249
  - **fix**: extracting `SwapMessage` to constants to avoid circular dependency. By @alessey #1255
  - **feat**: enhanced Framegear Home component with layout, loading state, and placeholder improvements. By @adarshswaminath #1241

  Breaking Changes

  Removed `walletCapabilities` from the `OnchainKitConfig` and improved the internal types by using the native Viem wallet capabilities type. This update ensures that wallet capabilities are now used solely as read info, avoiding accidental changes to wallet capabilities.

  The `<TransactionButton>` will no longer have a preset margin, allowing you to customize your app's spacing. Please check your app to see if you need to add a 4px margin. We aim to provide more neutral spacing, giving you the flexibility to add margin as needed.

  The `LifeCycleStatus` type is now renamed `LifecycleStatus`. This update aligns with React's lifecycle naming best practices, ensuring a smoother experience with your app. Please take note of this improvement.

## 0.31.6

### Patch Changes

- **feat**: added custom max slippage support in the `Swap` component along with a new settings dropdown UI. By @cpcramer #1176 #1248
- **feat**: added type `LifecycleStatusDataShared` to the `LifeCycleStatus` to hold shared lifeCycle state. By @zizzamia #1234 #1240
- **feat**: introduced `config` for the `Swap` component, with the first option for `maxSlippage`. By @zizzamia & @cpcramer #1242
- **fix**: added spacing between swap input and token select. By @alessey #1229

## 0.31.5

### Patch Changes

- **feat**: added calls support to `Transaction` component. By @0xAlec #1220
- **feat**: added `ConnectWalletText` to help customize style within `ConnectWallet`. By @zizzamia #1116 #1222
- **feat**: added `isMainnetOnly` to `isBase` and `isEthereum` utilities. By @zizzamia #1167 #1221
- **fix**: fixed issue with inputText state persisting to latter Framegear frames. By @brendan-defi #1218

## 0.31.4

### Patch Changes

- **feat**: added support for `EIP-5792` (https://eips.ethereum.org/EIPS/eip-5792) in `OnchainKitProvider`. By@0xAlec #1181
- **fix**: adjusted hover styling for the `Fund` and `Disconnect` wallet components in mobile view. By @cpcramer #1211
- **feat** added `walletCapabilities` for atomic batching (`useWriteContracts` vs `useWriteContract`) in`Transaction` component. By @0xAlec #1214

## 0.31.3

### Patch Changes

- **feat**: added `buildPayTransaction` utilities for making RPC calls to hydrate a charge and build a pay transaction in preparation for `Pay` button. By @avidreder #1177
- **feat**: implemented custom slippage support sub-components in the `Swap` component. By @cpcramer #1187 #1192 #1191 #1195 #1196 #1206
- **docs**: added Build Onchain Apps guide using OnchainKit's `app template`. By @zizzamia #1202
- **fix**: updated v1 `Swap` API to pass the correct slippage unit of measurement. By @cpcramer #1189

## 0.31.2

### Patch Changes

- **feat**: added connect wallet functionality to Swap component for disconnected users. By @abcrane123 #1173
- **fix**: added logic to refetch balances and clear inputs after Swap succeeds. By @0xAlec #1089
- **fix**: adjusted Swap component style to prevent UI shifting. By @abcrane123 #1184

## 0.31.1

### Patch Changes

- **fix**: improved hover state for WalletDropdown component. By @cpcramer #1156
- **feat**: added `onchainkit-version` header to API requests. By @0xAlec #1169
- **feat**: introduced `getAddress` and `useAddress` utilities to easily retrieve an address from ENS name or basename. By @zizzamia #1170

## 0.31.0

### Minor Changes

- **fix**: error message in `Swap` experience. By @zizzamia & @0xAlec #1154 #1153 #1155 4382d93
- **fix**: removed `address` prop from `Swap` component. By @abcrane123 #1145
- **feat**: moving `getTokens`, `buildSwapTransaction` and `getSwapQuote` under the API module. By @zizzamia #1146 #1151
- **fix**: handled SSR hydration issues. By @abcrane123 #1117

Breaking Changes
We streamlined the `Swap` experience to match the `Transaction` experience by eliminating the need for an `address` prop, making it work automatically.

All APIs within OnchainKit are now consolidated under the `@coinbase/onchainkit/api` module. There's no change in functionality; simply import them from the `api` module.

## 0.30.0

### Minor Changes

- **feat**: Moved the `onError` and `onSuccess` lifecycle listeners from the `<SwapButton>` component to the `<Swap>` component. By @zizzamia #1139 ed2379e

Breaking Changes
OnchainKit standardizes lifecycle listeners with three callbacks: `onError`, `onSuccess`, and `onStatus`. The `onError` and `onSuccess` callbacks handle only the `error` and `success` states,respectively. In contrast, the `onStatus` callback provides more granular phases of each component's experience.

Before, we used `onError` and `onSuccess` in the `<SwapButton />` component.

```ts
const handleOnError = useCallback((error) => {
  console.log(error);
}, []);
const handleOnSuccess = useCallback((response) => {
  console.log(response);
}, []);

...

<Swap address={address}>
  <SwapAmountInput
    label="Sell"
    swappableTokens={swappableTokens}
    token={ETHToken}
    type="from"
  />
  <SwapToggleButton />
  <SwapAmountInput
    label="Buy"
    swappableTokens={swappableTokens}
    token={USDCToken}
    type="to"
  />
  <SwapButton
    onError={handleOnError}
    onSuccess={handleOnSuccess}
  />
  <SwapMessage />
</Swap>
```

After, we use `onStatus` in the `<Swap />` component.

```ts
const handleOnStatus = useCallback((lifeCycleStatus: LifeCycleStatus) => {
  console.log('Status:', lifeCycleStatus);
}, []);

...

<Swap
  address={address}
  onStatus={handleOnStatus}
>
  <SwapAmountInput
    label="Sell"
    swappableTokens={swappableTokens}
    token={ETHToken}
    type="from"
  />
  <SwapToggleButton />
  <SwapAmountInput
    label="Buy"
    swappableTokens={swappableTokens}
    token={USDCToken}
    type="to"
  />
  <SwapButton />
  <SwapMessage />
</Swap>
```

The `onStatus` callback will expose

```ts
export type LifeCycleStatus =
  | {
      statusName: 'init';
      statusData: null;
    }
  | {
      statusName: 'error';
      statusData: SwapError;
    }
  | {
      statusName: 'amountChange';
      statusData: null;
    }
  | {
      statusName: 'transactionPending';
      statusData: null;
    }
  | {
      statusName: 'transactionApproved';
      statusData: {
        transactionHash: Hex;
        transactionType: 'ERC20' | 'Permit2';
      };
    }
  | {
      statusName: 'success';
      statusData: {
        transactionReceipt: TransactionReceipt;
      };
    };
```

## 0.29.5

### Patch Changes

- **feat**: exported `buildSwapTransaction`, `getSwapQuote` and `getTokens` from API module. By @zizzamia #1133 07c5af6
- **feat**: added `useSendCall` and `useSendCalls` hooks to support call-type transactions in `Transaction` component. By @0xAlec #1130

## 0.29.4

### Patch Changes

- **feat**: moved `onSuccess` and `onError` for Swap component at top level. By @zizzamia #1123 886d974
- **patch**: removed unnecessary address prop from `Transaction` component and fix issue where Sponsor component isn't visible. By @abcrane123 #1114
- **chore**: updated disconnect SVG image. By @cpcramer #1103
- **fix**: improved issue with Swap where it wasn't fetching quote for amount without a leading 0. By @abcrane123 #1128

## 0.29.3

### Patch Changes

- **chore**: Update all cases of BaseName to Basename. Update `WalletDropdownBaseName` to `WalletDropdownBasename`. Update the identity type `BaseName` to `Basename` and `WalletDropdownBaseNameReact` to `WalletDropdownBasenameReact`. By @cpcramer #1110 3d47932

## 0.29.2

### Patch Changes

- **fix**: better defined pressable classes were accessing the hover state variable. Update the `TransactionButton` and `WalletDropdown` to use our pre-existing pressable classes. By @cpcramer #1092 704e160
- **feat**: added `transactionIdle` and `transactionPending` to `lifeCycleStatus` in the Transaction experience. By @zizzamia #1088

## 0.29.1

### Patch Changes

- **feat**: `WalletDropdownFundLink` small improvements. By @0xAlec #1070 a17237a
- **feat**: better handling of `FrameButton` post actions. By @brendan-defi #1053
- **fix**: default accountChain for `Identity` component. By @zizzamia #1071

## 0.29.0

### Minor Changes

- **feat**: updated view transaction link experience. By @abcrane123 #1016 ccfc47f
- **fix**: modified `Avatar` component to handle images with varying height/width ratio. By @kirkas #1058
- **chore**: removed console.log statement in `useWriteContracts`. By @abcrane123 #1048
- **feat**: added mobile drawer for `Wallet` experience, and `useBreakpoints` hook. By @abcrane123 #1045
- **feat**: introduced `onStatus` listener, to help expose the internal `Transaction`'s component lifecycle.By @zizzamia #1034 #1047 #1055
- **feat**: added `WalletDropdownFundLink` component as dropdown link for the keys.coinbase.com funding flow.By @0xAlec #1021
- **chore**: increased `Wallet` dropdown png size to 18x18. By @cpcramer #1041 #1064
- **chore**: `Transaction` components cleanup. By @zizzamia #1028 #1029 #1052
- **fix**: adjusted dark mode within `TransactionToast`. By @abcrane123 #1020

## 0.28.7

### Patch Changes

- **fix**: `Wallet` components svg render. By @cpcramer #1011 c14ca17

## 0.28.6

### Patch Changes

- **fix**: exported `TransactionResponse` type. By @abcrane123 #1007 2169905

## 0.28.5

### Patch Changes

- **feat**: added `isBasename` and `getBaseDefaultProfilePicture` function to resolve to default avatars. By @kirkas #1002 9fbb7ec
- **feat**: modified `getAvatar` to resolve default avatars, only for basenames. By @kirkas #1002

## 0.28.4

### Patch Changes

- **chore**: updated all Wallet dropdown SVGs to render 16x16. Update text to Claim Basename (if no Basename), otherwise "Profile". By @cpcramer #990 0351295
- **feat**: added chain props to `useAvatar` and `getAvatar` to resolve Base avatar. By @kirkas #986
- **feat**: modified `getAvatar` to resolve Base avatar, and fallback to mainnet if none is found. By @kirkas #986

## 0.28.3

### Patch Changes

- **fix**: wallet dark mode. By @kyhyco #995 031251d

## 0.28.2

### Patch Changes

- **feat**: dark mode. By @kyhyco #977 d0e2a08

## 0.28.1

### Patch Changes

- **feat**: added `Permit2` approval process for UniversalRouter in the `Swap` experience. By @0xAlec #980 16c004b

## 0.28.0

### Minor Changes

- **feat**: refactored the `<Transaction>` component's `onSuccess` handler to manage multiple receipts for various contracts, supporting both EOA and Smart Wallet scenarios. baa5cf8

Breaking Changes
When using `onSuccess` in the `<Transaction>` component, refactor the response to handle:

```ts
type TransactionResponse = {
  transactionReceipts: TransactionReceipt[];
};
```

## 0.27.1

### Patch Changes

- **fix**: added Base Names testnet compatibility. By @cpcramer #966 a348e27
- **chore**: organized const variables and update imports for the `Transaction` component. By @cpcramer #961
- **fix**: added close wallet dropdown when clicking outside of the component's container. By @cpcramer #925

## 0.27.0

### Minor Changes

- **feat**: renamed `<TransactionToast>` prop from `delayMs` to `durationMs`. By @abcrane123 #967 f40b855

Breaking Changes
The `delayMs` prop for the `<TransactionToast>` component has been renamed to `durationMs`. Thischange clarifies that `delay` refers to when something starts, while `duration` specifies how longit lasts.

Learn more about this component type at https://onchainkit.xyz/transactiontypes#transactiontoastreact

## 0.26.16

### Patch Changes

- **feat**: add `onStart` hook to `SwapButton`. By @0xAlec #914 904e495

## 0.26.15

### Patch Changes

- **feat**: added experimental configurable maxSlippage feature for `Swap`. By @0xAlec #946 1c0ba1d

## 0.26.14

### Patch Changes

- **feat**: added `WalletDropdownBaseName` component. By @cpcramer #913 d50b85d

## 0.26.13

### Patch Changes

- **feat**: continued `Transaction` component QA. By @abcrane123 #944 1110ec9

## 0.26.12

### Patch Changes

- **fix**: handle edge case in `toReadableAmount`. By @0xAlec #934 74bd1a0
- **fix**: hide sponsor if txn in progress. By @abcrane123 #931

## 0.26.11

### Patch Changes

- **fix**: `formatDecimals` precision. By @0xAlec #912 5d9b4f8
- **fix**: additional `Transaction` component QA. By @abcrane123 #923 #931

## 0.26.10

### Patch Changes

- **fix**: made `IdentityProvider` to use address directly when switching address. By @kirkas #910 e4a9c5c

## 0.26.9

### Patch Changes

- **feat**: added wait for transaction receipt hook. By @abcrane123 #907 41e27f6

## 0.26.8

### Patch Changes

- **fix**: `WalletCapabilities` type in the Transaction component. By @zizzamia #908 69119dc

## 0.26.7

### Patch Changes

- **fix**: updated Base mainnet L2 resolver address. By @kirkas #903 04e1376
- **feat**: added `SmartWalletCapabilities` paymaster support in the `Transaction` component. By @ilikesymmetry @cpcramer #893

## 0.26.6

### Patch Changes

- **fix**: have `WalletDropdownDisconnect` to correctly disconnect all connectors. By @kirkas #895 8e78166

## 0.26.5

### Patch Changes

- **feat**: added `convertChainIdToCoinType` function to convert a chainId to a coinTypeHex for ENSIP-19 reverse resolution. By @kirkas #891 3cfbdc0
- **fix**: modified `convertReverseNodeToBytes` to use `convertChainIdToCoinType` instead of hardcoded resolver address. By @kirkas #891
- **fix**: modified `useName` to return a type `BaseName` for extra type safety. By @kirkas #891
- **feat**: Add more storybook scenarios for `<Name>`. By @kirkas #891

## 0.26.4

### Patch Changes

- **feat**: added experimental API for `Swap` components to enable UniswapRouter. By @0xAlec #878 6cf5f66

## 0.26.3

### Patch Changes

- **fix**: fetch ens with `getName`. By @zizzamia #888 92a0cf0

## 0.26.2

### Patch Changes

- **fix**: colors for `Swap` components. By @zizzamia #879 6992cff
- **chore**: adjust messaging related to transaction status. By @abcrane123 #875
- **fix**: have `useName` hook to use `chain.id` in the query key to avoid overlap between chains. By @kirkas #869
- **feat**: added EOA account support to `Transaction` component. By @cpcramer #866

## 0.26.1

### Patch Changes

- **fix**: copy popover style within the `IdentityLayout`. By @zizzamia #870 3128263
- **feat**: added toast animation for `TransactionToast` component. By @abcrane123 #865

## 0.26.0

### Minor Changes

- **feat**: added the `ock` prefix to the Tailwind configuration to prevent conflicting styles (#852) when using OnchainKit alongside an existing Tailwind setup. By @zizzamia #867 ff8d359

Breaking Changes

For apps using OnchainKit with the same Tailwind variables, you might see style changes. We recommend following the guide at https://onchainkit.xyz/guides/tailwind or adjusting your custom OnchainKit styles. If you encounter any issues, reach out to [@zizzamia](https://twitter.com/Zizzamia) or [@onchainkit](https://twitter.com/onchainkit) on Twitter for immediate assistance.

## 0.25.7

### Patch Changes

- **feat**: added `TransactionSponsor` component. By @abcrane123 #853 a2eae6c
- **chore**: updated sliced address to display the first and last 4 characters. By @cpcramer #847

## 0.25.6

### Patch Changes

- **fix**: `Name` component to return the sliced address when no ENS name is found. By @cpcramer #842 387e2b4
- **feat**: polish `Transaction` component. By @abcrane123 #831 #835
- **chore**: fix TransactionGasFee test. By @cpcramer #830

## 0.25.5

### Patch Changes

- **feat**: adjust `writeContracts` functionality. By @zizzamia #826 53ba268
- **feat**: added `Transaction` toast components. By @zizzamia #818
- **chore**: added unit tests to the `Transaction` component. By @cpcramer #817

## 0.25.4

### Patch Changes

- **chore**: exported `Transaction` components. By @zizzamia #820 8e07918

## 0.25.3

### Patch Changes

- **feat**: added initial version of `Transaction` component. By @abcrane123 & @zizzamia #816 #787 5c6ce95
- **feat**: updated Viem and Wagmi version. By @zizzamia #815
- **chore**: Add WalletDropdown Disconnect and Link tests. By @cpcramer #810
- **chore**: Add Identity unit tests. By @cpcramer #807

## 0.25.2

### Patch Changes

- **feat**: added RainbowKit support to the `ConnectWallet` component. By @zizzamia #797 d80b01e

## 0.25.1

### Patch Changes

- **fix**: modified `getName` to default to ENS name when custom chain name is not available. By @kirkas #792 7ef7bac

## 0.25.0

### Minor Changes

- **feat**: `Swap` ERC-20 Approval Flow. This is a breaking change that removes the `onSubmit` functionality from the `SwapButton` component and adds an approval flow for swapping from ERC-20 tokens. By @0xAlec #761. 77531f4
- **feat**: Added `chain` option to `<IdentityProvider>` for L2 chain name resolution support. By@kirkas #781
- **feat**: Added `chain` option to `<Identity>` component for L2 chain name resolution support. By@kirkas #781
- **fix**: Modify `<Name>` to prioritize its own address/chain props over the provider's. By @kirkas#781
- **fix**: Modify `<Address>`, `<Avatar>`, `<EthBalance>` & `<DisplayBadge>` to prioritize its ownaddress prop over the provider's. By @kirkas #781

Breaking Changes

Removed the `onSubmit` functionality from the `SwapButton` component and adds an approval flow forswapping from ERC-20 tokens.

## 0.24.5

### Patch Changes

- **feat**: Added `chain` option to `useName` function for L2 chain name resolution support. By @kirkas #781 beed765
- **feat**: Added `chain` option to `<Name>` component for L2 chain name resolution support. By @kirkas #781
- **fix**: Modified `getName` to return a rejected promise instead of an error. By @kirkas #781
- **fix**: Disabled `retry` in `getNewReactQueryTestProvider` to run tests faster and avoid timeouts. By @kirkas #781

## 0.24.4

### Patch Changes

- **feat**: added `chain` option to `getName`, this will help add ENS support for L2 chains. By @kirkas #773 19fd6b8
- **feat**: added `isEthereum` function, to help check if a chain is L1. By @kirkas #773
- **chore**: simplified type for `getAttestations`. By @zizzamia

## 0.24.3

### Patch Changes

- **feat**: added `isSliced` option to the `Address` component. This allows this component to render the full users address when set to false. Update `getName` and the `Name` component to return `null` if the ENS name is not found for the given address. By @cpcramer #737 8124f8c

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

- **fix**: revert peer dependency PRs. f4fcd2a

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
- **feat**: added swappable tokens to `SwapAmountInput`. By @abcrane123 #561
- **fix**: updated Smart Wallet util. By @lukasrosario #564
- **chore**: updated `isWalletASmartWallet` name to be `isWalletACoinbaseSmartWallet`. We want to explicitly state that this is checking for Coinbase Smart Wallets. By @cpcramer #562
- **feat**: enabled linting in CI. By @zizzamia #559

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
- **feat**: converted `TokenRow` to css, add modifier state and add additional display controls. By @kyhyco #473

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
