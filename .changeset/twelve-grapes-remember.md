---
"@coinbase/onchainkit": minor
---

- **feat**: refactored the `<Transaction>` component's `onSuccess` handler to manage multiple receipts for various contracts, supporting both EOA and Smart Wallet scenarios.

Breaking Changes
When using `onSuccess` in the `<Transaction>` component, refactor the response to handle:

```ts
type TransactionResponse = {
  transactionReceipts: TransactionReceipt[];
};
```