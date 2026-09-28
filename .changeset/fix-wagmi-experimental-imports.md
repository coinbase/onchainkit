---
"@coinbase/onchainkit": patch
---

**fix:** update `wagmi/experimental` imports to `wagmi`. The `useCapabilities`, `useSendCalls`, and `useCallsStatus` hooks were stabilized and moved from `wagmi/experimental` to `wagmi` in wagmi v2.15.0. This fixes build/runtime errors for consumers using newer wagmi versions.
