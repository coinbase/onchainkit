---
"@coinbase/onchainkit": patch
---

- **chore**: Remove the bottom WalletDropdown padding and instead apply the bottom padding directly on the WalletDropdownDisconnect component. This fixes a bug where the WalletDropdown bottom padding would unintentionally change on:hover. @cpcramer #1156
