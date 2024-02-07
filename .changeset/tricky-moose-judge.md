---
'@coinbase/onchainkit': patch
---

- **fix**: `<FrameMetadata>` component when used with Helmet. To ensure smooth functionality when used with Helmet as a wrapper component, it is crucial to flatten the Buttons loop. By @zizzamia #99
- **feat**: added `Avatar` component, to our Identity Kit. The `Avatar` component primarily focuses on showcasing ENS avatar for given Ethereum addresses, and defaults to a default SVG avatar when an ENS avatar isn't available. By @alvaroraminelli #69
