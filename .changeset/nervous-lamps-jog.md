---
'@coinbase/onchainkit': minor
---

- **feat**: set v2 as default API for Swap. by @0xAlec #1254
- **chore**: updated `SwapSettingsSlippageInput` to use the input config defaultMaxSlippage value. By @cpcramer #1263
- **feat**: added batched Swap transactions from ERC-20. by @0xAlec #1272

Breaking Changes

Updated `LifecycleStatus` in `Swap` component for swaps from ERC-20 tokens.
Previously, there were 2 transactions when swapping from an ERC-20 token.
Now, there is an extra approval. (Approve ERC-20 against Permit2 -> Approve Uniswap to spend the approved ERC-20s on Permit2 -> Execute Swap Transaction)
Additionally, for Coinbase Smart Wallet users, transaction calls are now batched so only one `transactionApproved` lifecycle status will be emitted under the `Batched` transaction type for swaps from ERC-20s.
If you're listening to the `LifecycleStatus` in `Swap`, please make sure your app accounts for the extra transaction.