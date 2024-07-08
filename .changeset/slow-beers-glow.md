---
"@coinbase/onchainkit": patch
---

- **feat**: exported `SwapToggleButtonReact`, `WalletDropdownDisconnectReact` and `WalletDropdownLinkReact` types. Added more custom option to `WalletDropdownLink` component. By @zizzamia #754

Breaking Changes

- `ConnectAccount` has been removed from `Wallet` module.
- `ConnectWallet`'s `label` prop renamed to `text`.
