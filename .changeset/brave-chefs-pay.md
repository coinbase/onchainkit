---
'@coinbase/onchainkit': minor
---

- **feat** have `getFrameAccountAddress` reading from the message instead of the body. By @zizzamia #46
- **feat** update `getFrameMetadata` to the latest [Frame APIs](https://warpcast.com/v/0x24295a0a) By @zizzamia #43

BREAKING CHANGES

We have enhanced the `getFrameAccountAddress` method by making it more composable with `getFrameMessage`. Now, instead of directly retrieving the `accountAddress` from the `body`, you will utilize the validated `message` to do so.

Before

```ts
import { getFrameAccountAddress } from '@coinbase/onchainkit';

...

const accountAddress = await getFrameAccountAddress(body);
```

After

```ts
import { getFrameAccountAddress } from '@coinbase/onchainkit';

...
const { isValid, message } = await getFrameMessage(body);
const accountAddress = await getFrameAccountAddress(message);
```
