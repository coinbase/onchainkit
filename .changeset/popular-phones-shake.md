---
'@coinbase/onchainkit': patch
---

- **feat**: exported `FrameButtonMetadata`, `FrameInputMetadata` and `FrameImageMetadata` types. By @zizzamia #111
- **feat**: introduced support for image aspect ratio metadata, ensuring backward compatibility. Image metadata can now be defined either as a string (with a default aspect ratio of `1.91:1`) or as an object with a src URL string and an aspect ratio of either `1.91:1` or `1:1`. By @taycaldwell #110
