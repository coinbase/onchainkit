---
'@coinbase/onchainkit': minor
---

- **feat**: `getFrameMessage` can now handle mock frame messages. When `allowDebug` is passed as an option (defaults to `false`), it will skip validating which facilitates testing locally running apps with future releases of `framegear`.
