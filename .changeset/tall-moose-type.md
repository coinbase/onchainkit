---
"@coinbase/onchainkit": patch
---

**feat** Add Appchain Bridge UI. by @0xAlec #1976
**fix** Add various improvements to the Earn component. by @dschlabach #1973
**docs** Add documentation for the Earn component. by @dschlabach #1974
**feat** Add telemetry to help us better understand library usage and improve the developer experience. @cpcramer
**chore** Update earnings token. By @alessey #1985
**fix** Remove circular dependency. By @dschlabach #1970


## Telemetry

Starting with version 0.37.0, OnchainKit introduces an anonymous telemetry system to help us better understand library usage and improve the developer experience. This system collects anonymous data about:

- Component usage and events
- Version and app information
- Usage metrics
- Error events

No sensitive data (environment variables, private keys, file paths) is ever collected.

### How to Opt Out

To fully disable telemetry collection, set the `analytics` flag to `false` in your OnchainKit Provider:

Learn more at https://onchainkit.xyz/guides/telemetry
