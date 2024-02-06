---
'@coinbase/onchainkit': minor
---

- **fix**: ensured that the `<FrameMetadata>` component uses the `name` property instead of the `property` property to set the type of metadata. Both options are technically correct, but historically, using `name` is more accurate.
- **feat**: renamed the component from `OnchainName` to `Name` in our Identity Kit. This is a breaking changes. The purpose of the rename is to simplify and enhance clarity. By @alvaroraminelli #86

BREAKING CHANGES

To enhance usability and intuitiveness, the component name has been simplified. `OnchainName` is now renamed to `Name`.

Before

```ts
import { OnchainName } from '@coinbase/onchainkit';

...
<OnchainName address="0x1234">
```

After

```ts
import { Name } from '@coinbase/onchainkit';

...
<Name address="0x1234">
```
