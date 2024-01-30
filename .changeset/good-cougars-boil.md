---
'@coinbase/onchainkit': minor
---

- **docs**: Polished README for `getFrameMessage()`. By @zizzamia #38
- **fix**: Refactor Farcaster typing to be explicit, and added a Farcaster message verification integration test. By @robpolak @cnasc @zizzamia #37
- **feat**: Added a concept of integration tests where we can assert the actual values coming back from `neynar`. We decoupled these from unit tests as we should not commingle. By @robpolak #35
- **feat**: Refactored `neynar` client out of the `./src/core` code-path, for better composability and testability. By @robpolak #35

BREAKING CHANGES

We made the `getFrameValidatedMessage` method more type-safe and renamed it to `getFrameMessage`.

Before

```ts
import { getFrameValidatedMessage } from '@coinbase/onchainkit';

...

const validatedMessage = await getFrameValidatedMessage(body);
```

**@Returns**

```ts
type Promise<Message | undefined>
```

After

```ts
import { getFrameMessage } from '@coinbase/onchainkit';

...

const { isValid, message } = await getFrameMessage(body);
```

**@Returns**

```ts
type Promise<FrameValidationResponse>;

type FrameValidationResponse =
  | { isValid: true; message: FrameData }
  | { isValid: false; message: undefined };

interface FrameData {
  fid: number;
  url: string;
  messageHash: string;
  timestamp: number;
  network: number;
  buttonIndex: number;
  castId: {
    fid: number;
    hash: string;
  };
}
```
