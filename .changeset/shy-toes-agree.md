---
'@coinbase/onchainkit': minor
---

- **feat**: added `getOnchainKitConfig` and `setOnchainKitConfig` to access and edit the share OnchainKit config directly. By @zizzamia #376

Breaking Changes
Removed `getFrameHtmlResponse`, `getFrameMessage`, `getMockFrameRequest` and Frames types from the root level exports. And you can find them going forward in `@coinbase/onchainkit/frame`.
