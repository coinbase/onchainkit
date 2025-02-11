---
"@coinbase/onchainkit": patch
---

- **docs**: Add Telemetry guide. By @cpcramer #1935
- **feat**: Added Telemetry foundation for `Buy`, `Checkout`, `Fund`, `Mint`, `Swap`, `Transaction`, and `Wallet`. By @cpcramer #1942
- **feat**: Add analytics parameter. When set to false, all telemetry collection will be disabled and no data will be sent. @cpcramer #1934
- **feat**: Release `Earn` component. By @dschlabach #1955
- **chore**: Bump wagmi dependencies. By @dschlabach #1949
- **fix**: Fix slow wallet resolution. By @dschlabach #1947
- **docs**: Update onramp documentation. By @rustam-cb #1945 #1939
- **fix**: Fix onramp util `fetchOnrampQuote`. By @rustam-cb #1940

Note: OnchainKit is not collecting any telemetry as of `v0.36.11`. This will be enabled in a future release.
