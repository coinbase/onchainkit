---
"@coinbase/onchainkit": patch
---

- **feat**: added `convertChainIdToCoinType` function to convert a chainId to a coinTypeHex for ENSIP-19 reverse resolution. By @kirkas #891
- **fix**: modified `convertReverseNodeToBytes` to use `convertChainIdToCoinType` instead of hardcoded resolver address. By @kirkas #891
- **fix**: modified `useName` to return a type `BaseName` for extra type safety. By @kirkas #891
- **feat**: Add more storybook scenarios for `<Name>`. By @kirkas #891
