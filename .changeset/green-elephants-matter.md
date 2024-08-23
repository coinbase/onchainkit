---
"@coinbase/onchainkit": minor
---

- **fix**: error message in `Swap` experience. By @zizzamia & @0xAlec #1154 #1153 #1155
- **fix**: removed `address` prop from `Swap` component. By @abcrane123 #1145
- **feat**: moving `getTokens`, `buildSwapTransaction` and `getSwapQuote` under the API module. By @zizzamia #1146 #1151
- **fix**: handled SSR hydration issues. By @abcrane123 #1117

Breaking Changes
We streamlined the `Swap` experience to match the `Transaction` experience by eliminating the need for an `address` prop, making it work automatically.

All APIs within OnchainKit are now consolidated under the `@coinbase/onchainkit/api` module. There's no change in functionality; simply import them from the `api` module.