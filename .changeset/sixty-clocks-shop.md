---
"@coinbase/onchainkit": patch
---

- **feat**: added `buildPayTransaction` utilities for making RPC calls to hydrate a charge and build a pay transaction in preparation for `Pay` button. By @avidreder #1177
- **feat**: implemented custom slippage support sub-components in the `Swap` component. By @cpcramer #1187 #1192 #1191 #1195 #1196 #1206
- **docs**: added Build Onchain Apps guide using OnchainKit's `app template`. By @zizzamia #1202
- **fix**: updated v1 `Swap` API to pass the correct slippage unit of measurement. By @cpcramer #1189
