---
'@coinbase/onchainkit': patch
---

- **feat**: all `FrameMetadataType` parameters have been updated to use consistent lowerCamelCase. It's important to note that we are not deprecating the old method, at least for a few weeks, to allow time for migration to the new approach. By @zizzamia #106
- **feat**: while there is no real issue in using either `property` or `name` as the standard for a metadata element, it is fair to respect the Open Graph specification, which originally uses `property`. By @zizzamia #106
