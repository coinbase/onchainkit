---
"@coinbase/onchainkit": minor
---

- **feat**: Added `Signature` component which utilizes wagmi signTypedData (EIP 712) and signMessage (personal_sign falling back to eth_sign) to sign data. @By alessey #2105
- **feat**: Added light/dark mode support for the Base `theme`. This will respect the `mode` setting in your `OnchainKitProvider` config (defaults to 'auto' if not specified). Users of the Base theme may now see light or dark variants depending on their system preferences or explicit mode configuration. By @cpcramer #2143
- **feat**: Added `Badge` tooltip display. By @cpcramer #2140
- **feat**: Implemented default children for `NFTCard`, `NFTMintCard`, and `Transaction` components. By @dgca @abcrane123 #2138 #2139 #2108
- **chore**: Updated `IsBaseOptions` and `IsEthereumOptions` type naming convention to PascalCase. By @crStiv @cpcramer #1920
- **chore**: Refactored `TokenBalance`'s ActionButton and improved `TokenBalance` types. By @brendan-defi #2068
- **chore**: Updated `Onramp` utils to allow to be used in non-react JS environments and/or without having to set up Onchainkit Provider. By @rustam-cb #2135
- **fix**: `TokenRow` text-overflow: ellipsis work correctly. By @dgca #2133

Breaking Changes: 
- Types `IsBaseOptions` and `IsEthereumOptions` have been updated from camelCase to PascalCase. 