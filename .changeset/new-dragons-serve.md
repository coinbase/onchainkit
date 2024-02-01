---
'@coinbase/onchainkit': minor
---

- **feat**: deprecated `getFrameAccountAddress` as now `getFrameMessage` returns also the Account Address. #60
- **feat**: integrated with Neynars api to get validated messages + additional context like recast/follow/etc. By @robpolak #59
- **fix**: removed farcaster references as they were generating build errors and compatibility issues. By @robpolak #59

BREAKING CHANGES

I will write the breaking changes in the next PR
