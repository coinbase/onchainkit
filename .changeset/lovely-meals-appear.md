---
"@coinbase/onchainkit": minor
---

- **feat**: added `showAddress` as an option to the `Name` component. By @zizzamia #322

Breaking Changes

The `Name` component will use `showAddress` to override the default ENS behavior, and `getName`. It will have multiple options as input, which means to pass the address you have to do `getName({ address })` instead of `getName(address)`.
