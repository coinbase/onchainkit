---
"@coinbase/onchainkit": patch
---

- **feat**: introducing `getFrameHtmlResponse` server-side helper method: generates HTML response with valid Frame, uses `FrameMetadata` types for page metadata, eliminates manual creation of server-side HTML strings.
- **feat**: the `FrameMetadata` type have been updated. Now, `buttons` and `post_url` are considered optional, aligning with the [Farcaster Frames API](https://warpcast.notion.site/Farcaster-Frames-4bd47fe97dc74a42a48d3a234636d8c5).
- **feat**: going forward, we will utilize `NEYNAR_ONCHAIN_KIT` as the default free API key for [Neynar](https://neynar.com/).
