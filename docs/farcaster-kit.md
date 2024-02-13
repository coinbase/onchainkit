### getFarcasterUserAddress

The `getFarcasterUserAddress` function retrieves the user address associated with a given Farcaster ID (fid). It provides options to specify whether the client wants `custody address` and/or `verified addresses`, and also allows the user to provide their own neynar api key. By default, both `custody` and `verified` addresses are provided.

```tsx
import { getFarcasterUserAddress } from '@coinbase/onchainkit/farcaster';

async function fetchUserAddress(fid: number) {
  // Returns custody and verified addresses. If there is an error, returns null
  const userAddress = await getFarcasterUserAddress(fid);
  console.log(userAddress);
}

fetchUserAddress(3);
```

**@Param**

```ts
// Fid - Farcaster Id
fid: number;

// Optional options to specify whether the client wants custody and/or verified addresses
// along with their neynar api key
type GetFarcasterUserAddressOptions =
  | {
      neynarApiKey?: string; // default to onchain-kit's default key
      hasCustodyAddresses?: boolean; // default to true
      hasVerifiedAddresses?: boolean; // default to true
    }
  | undefined;
```

**@Returns**

```ts
type GetFarcasterUserAddressResponse = {
  // Custody Address of a given fid
  custodyAddress?: string;
  // List of all verified addresses for a given fid
  verifiedAddresses?: string[];
};
```
