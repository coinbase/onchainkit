---
"@coinbase/onchainkit": minor
---

- **feat**: renamed `<TransactionToast>` prop from `delayMs` to `durationMs`. By @abcrane123 #967

Breaking Changes

The `delayMs` prop for the `<TransactionToast>` component has been renamed to `durationMs`. This change clarifies that `delay` refers to when something starts, while `duration` specifies how long it lasts. 

Learn more about this component type at https://onchainkit.xyz/transaction/types#transactiontoastreact
