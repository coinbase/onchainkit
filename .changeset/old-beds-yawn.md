---
"@coinbase/onchainkit": patch
---
- **feat**: Added `chain` option to `<IdentityProvider>` for L2 chain name resolution support. By @kirkas #781
- **feat**: Added `chain` option to `<Identity>` component for L2 chain name resolution support. By @kirkas #781
- **fix**: Modify `<Name>` to prioritize its own address/chain props over the provider's. By @kirkas #781
- **fix**: Modify `<Address>`, `<Avatar>`, `<EthBalance>` to prioritize its own address prop over the provider's. By @kirkas #781