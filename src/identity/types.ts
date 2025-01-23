import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import type { Address, Chain } from 'viem';

/**
 * Note: exported as public Type
 */
export type AddressReact = {
  /** The Ethereum address to render. */
  address?: Address | null;
  /** Optional className override for top span element. */
  className?: string;
  /** Determines if the displayed address should be sliced. (defaults: true) */
  isSliced?: boolean;
  /** Defaults to true. Optional boolean to disable copy address on click functionality. */
  hasCopyAddressOnClick?: boolean;
};

/**
 * Ethereum Attestation Service (EAS) Attestation
 * GraphQL response for EAS Attestation
 *
 * Note: exported as public Type
 */
export type Attestation = {
  /** The attester who created the attestation. */
  attester: Address;
  /** The attestation data decoded to JSON. */
  decodedDataJson: string;
  /** The Unix timestamp when the attestation expires (0 for no expiration). */
  expirationTime: number;
  /** The unique identifier of the attestation. */
  id: string;
  /** The Ethereum address of the recipient of the attestation. */
  recipient: Address;
  /** The Unix timestamp when the attestation was revoked, if applicable. */
  revocationTime: number;
  /** A boolean indicating whether the attestation is revoked or not. */
  revoked: boolean;
  /** The schema identifier associated with the attestation. */
  schemaId: EASSchemaUid;
  /** The Unix timestamp when the attestation was created. */
  time: number;
};

/**
 * Note: exported as public Type
 */
export type AvatarReact = {
  /** The Ethereum address to fetch the avatar for. */
  address?: Address | null;
  /** Optional chain for domain resolution */
  chain?: Chain;
  /** Optional className override for top div element. */
  className?: string;
  /** Optional custom component to display while the avatar data is loading. */
  loadingComponent?: JSX.Element;
  /** Optional custom component to display when no ENS name or avatar is available. */
  defaultComponent?: JSX.Element;
  /** Optional attestation by passing Badge component as its children */
  children?: ReactNode;
} & ImgHTMLAttributes<HTMLImageElement>; /** Optional additional image attributes to apply to the avatar. */

/**
 * Note: exported as public Type
 */
export type BadgeReact = {
  /** Optional className override for top span element. */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type BaseMainnetName = `${string}.base.eth`;

/**
 * Note: exported as public Type
 */
export type Basename = BaseMainnetName | BaseSepoliaName;

/**
 * Note: exported as public Type
 */
export type BaseSepoliaName = `${string}.basetest.eth`;

export type GetSocialsReturnType = {
  /** Twitter handle */
  twitter: string | null;
  /** GitHub username */
  github: string | null;
  /** Farcaster username */
  farcaster: string | null;
  /** Website URL */
  website: string | null;
};

/**
 * Ethereum Attestation Service (EAS) Schema Uid
 * The schema identifier associated with the EAS attestation.
 *
 * Note: exported as public Type
 */
export type EASSchemaUid = `0x${string}`;

/**
 * Ethereum Attestation Service (EAS) Chain Definition
 * The definition of a blockchain chain supported by EAS attestations.
 *
 * Note: exported as public Type
 */
export type EASChainDefinition = {
  /** EAS GraphQL API endpoint */
  easGraphqlAPI: string;
  /** blockchain source id */
  id: number;
  /** Array of EAS Schema UIDs */
  schemaUids: EASSchemaUid[];
};

/**
 * Note: exported as public Type
 */
export type EthBalanceReact = {
  /** Ethereum address */
  address?: Address;
  /** Optional className override */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type GetAddress = {
  /** Name to resolve */
  name: string | Basename;
  /** Optional chain for domain resolution */
  chain?: Chain;
};

/**
 * Note: exported as public Type
 */
export type GetAddressReturnType = Address | null;

/**
 * Note: exported as public Type
 */
export type GetAttestationsOptions = {
  /** Array of schema UIDs to filter by */
  schemas?: EASSchemaUid[];
  /** Filter by revocation status */
  revoked?: boolean;
  /** Filter by expiration time */
  expirationTime?: number;
  /** Limit number of results */
  limit?: number;
};

/**
 * Note: exported as public Type
 */
export type GetAvatar = {
  /** The ENS name to fetch the avatar for. */
  ensName: string;
  /** Optional chain for domain resolution */
  chain?: Chain;
};

/**
 * Note: exported as public Type
 */
export type GetAvatarReturnType = string | null;

/**
 * Note: exported as public Type
 */
export type GetName = {
  /** Ethereum address to resolve */
  address: Address;
  /** Optional chain for domain resolution */
  chain?: Chain;
};

/**
 * Note: exported as public Type
 */
export type GetNameReturnType = string | Basename | null;

/**
 * Note: exported as public Type
 */
export type IdentityContextType = {
  /** The Ethereum address to fetch the avatar and name for. */
  address: Address;
  /** Optional chain for domain resolution */
  chain?: Chain;
  /** The Ethereum address of the schema to use for EAS attestation. */
  schemaId?: Address | null;
};

export type IdentityProviderReact = {
  /** Ethereum address */
  address?: Address;
  /** Child components */
  children: ReactNode;
  /** Schema ID for attestations */
  schemaId?: Address | null;
  /** Optional chain for domain resolution */
  chain?: Chain;
};

/**
 * Note: exported as public Type
 */
export type IdentityReact = {
  /** The Ethereum address to fetch the avatar and name for. */
  address?: Address;
  /** Optional chain for domain resolution */
  chain?: Chain;
  /** Child components */
  children: ReactNode;
  /** Optional className override for top div element. */
  className?: string;
  /** The Ethereum address of the schema to use for EAS attestation. */
  schemaId?: Address | null;
  /** Optional boolean to disable copy address on click functionality. */
  hasCopyAddressOnClick?: boolean;
};

/**
 * Note: exported as public Type
 */
export type NameReact = {
  /** Ethereum address to be displayed. */
  address?: Address | null;
  /** Optional attestation by passing Badge component as its children */
  children?: ReactNode;
  /** Optional chain for domain resolution */
  chain?: Chain;
  /** Optional className override for top span element. */
  className?: string;
} & HTMLAttributes<HTMLSpanElement>; /** Optional additional span attributes to apply to the name. */

export type ResolverAddressesByChainIdMap = Record<number, Address>;

export type UseAttestations = {
  /** Ethereum address */
  address: Address;
  /** Chain for resolution */
  chain: Chain;
  /** Schema ID for attestations */
  schemaId: Address | null;
};

/**
 * Note: exported as public Type
 */
export type UseAddressOptions = {
  /** The ENS or Basename for which the Ethereum address is to be fetched */
  name: string | Basename;
  /** Optional chain for domain resolution */
  chain?: Chain;
};

/**
 * Note: exported as public Type
 */
export type UseAvatarOptions = {
  /** ENS name to resolve */
  ensName: string;
  /** Optional chain for domain resolution */
  chain?: Chain;
};

/**
 * Note: exported as public Type
 */
export type UseQueryOptions = {
  /** Whether the query should execute */
  enabled?: boolean;
  /** Cache time in milliseconds */
  cacheTime?: number;
};

/**
 * Note: exported as public Type
 */
export type UseNameOptions = {
  /** The Ethereum address for which the ENS name is to be fetched. */
  address: Address;
  /** Optional chain for domain resolution */
  chain?: Chain;
};
