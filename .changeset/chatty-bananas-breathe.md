---
'@coinbase/onchainkit': minor
---

- **feat**: Updated `FrameMetadataType` to support `target` for button `post` and `post_redirect` actions. By @HashWarlock @zizzamia #130 #136

Note:
In this release we update the `FrameMetadataType` so that it supports the latest [Handling Clicks](https://docs.farcaster.xyz/reference/frames/spec#handling-clicks) Frames specification.

If the button clicked is a `post` or `post_redirect`, apps must:
1. Construct a Frame Signature Packet.
2. POST the packet to `fc:frame:button:$idx:target` if present
3. POST the packet to `fc:frame:post_url if target` was not present.
4. POST the packet to or the frame's embed URL if neither target nor action were present.
5. Wait at least 5 seconds for a response from the frame server.