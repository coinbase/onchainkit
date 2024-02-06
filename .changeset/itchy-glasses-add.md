---
'@coinbase/onchainkit': minor
---

- **feat**: Rename the component from `OnchainName` in our Identity Kit. This is a breaking change. `OnchainName` is being renamed to `Name` for simplicity and clarity.

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
