---
"@coinbase/onchainkit": patch
---

- **fix**: better defined pressable classes were accessing the hover state variable. Update the `TransactionButton` and `WalletDropdown` to use our pre-existing pressable classes. By @cpcramer #1092
- **feat**: added `transactionIdle` and `transactionPending` to `lifeCycleStatus` in the Transaction experience. By @zizzamia #1088
