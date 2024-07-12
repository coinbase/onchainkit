---
"@coinbase/onchainkit": minor
---

- **feat**: `Swap` ERC-20 Approval Flow. This is a breaking change that removes the `onSubmit` functionality from the `SwapButton` component and adds an approval flow for swapping from ERC-20 tokens. By @0xAlec #761.
- **feat**: Added `chain` option to `<IdentityProvider>` for L2 chain name resolution support. By @kirkas #781
- **feat**: Added `chain` option to `<Identity>` component for L2 chain name resolution support. By @kirkas #781
- **fix**: Modify `<Name>` to prioritize its own address/chain props over the provider's. By @kirkas #781
- **fix**: Modify `<Address>`, `<Avatar>`, `<EthBalance>` & `<DisplayBadge>` to prioritize its own address prop over the provider's. By @kirkas #781

Breaking Changes

Removed the `onSubmit` functionality from the `SwapButton` component and adds an approval flow for swapping from ERC-20 tokens.
