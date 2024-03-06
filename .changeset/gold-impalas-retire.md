---
'@coinbase/onchainkit': minor
---

- **feat**: Replace internal `useOnchainActionWithCache` with `tanstack/react-query`. This affects `useName` and `useAvatar` hooks. The return type and the input parameters also changed for these 2 hooks.

BREAKING CHANGES

The input parameters as well as return types of `useName` and `useAvatar` hooks have changed. The return type of `useName` and `useAvatar` hooks changed.

### `useName`

Before

```tsx
import { useName } from '@coinbase/onchainkit/identity';

const { ensName, isLoading } = useName('0x1234');
```

After

```tsx
import { useName } from '@coinbase/onchainkit/identity';

// Return type signature is following @tanstack/react-query useQuery hook signature
const {
  data: name,
  isLoading,
  isError,
  error,
  status,
} = useName({ address: '0x1234' }, { enabled: true, cacheTime: 1000 * 60 * 60 * 24 });
```

### `useAvatar`

Before

```tsx
import { useAvatar } from '@coinbase/onchainkit/identity';

const { ensAvatar, isLoading } = useAvatar('vitalik.eth');
```

After

```tsx
import { useAvatar } from '@coinbase/onchainkit/identity';

// Return type signature is following @tanstack/react-query useQuery hook signature
const {
  data: avatar,
  isLoading,
  isError,
  error,
  status,
} = useAvatar({ ensName: 'vitalik.eth' }, { enabled: true, cacheTime: 1000 * 60 * 60 * 24 });
```
