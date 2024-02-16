# Identity Kit 👨‍🚀

## Name

The Name component is used to display ENS names associated with Ethereum addresses. When an ENS name is not available, it defaults to showing a truncated version of the address.

```ts
import { Name } from '@coinbase/onchainkit';


<Name address="0x1234567890abcdef1234567890abcdef12345678" sliced={false} />;
```

## @Props

```ts
type UseName = {
  // Ethereum address to be resolved from ENS.
  address: Address;
  // Optional CSS class for custom styling.
  className?: string;
  // Determines if the address should be sliced when no ENS name is available.
  sliced?: boolean;
  // Additional HTML attributes for the span element.
  props?: React.HTMLAttributes<HTMLSpanElement>;
};
```

## Ethereum Attestation Service (EAS)

The Ethereum Attestation Service (EAS) facilitates secure, decentralized attestations on the blockchain. We are launching functions to simplify accessing and managing these attestations across multiple blockchains, enhancing usability for developers and users.

## getEASAttestations

The `getEASAttestations` function fetches EAS attestations for a specified address and blockchain. It allows optional filtering based on schema IDs, revocation status, expiration time, and the number of attestations to return.

```ts
import { getEASAttestations } from '@coinbase/onchainkit';
import { base } from 'viem/chains';

const attestations = await getEASAttestations({
  '0x1234567890abcdef1234567890abcdef12345678',
  base,
  {
    // Optional schemas to filter the attestations.
    schemas: ['0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065'],
  },
});

console.log(attestations);
```

**@Param**

```ts
// Address - Ethereum address for which attestations are being queried
address: Address;

// Chain - The blockchain of interest
chain: Chain;

// Optional filtering options for the attestations query
type GetEASAttestationsOptions = {
  schemas?: EASSchemaUid[]; // Schema IDs to filter attestations
  revoked?: boolean; // Filter for revoked attestations (default: false)
  expirationTime?: number; // Unix timestamp to filter based on expiration time (default: current time)
  limit?: number; // Maximum number of attestations to return (default: 10)
};
```

**@Returns**

```ts
// Array of EAS Attestation objects
type GetEASAttestationsResponse = EASAttestation[];
```
