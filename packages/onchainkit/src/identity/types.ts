import type { UseQueryOptions as TanstackUseQueryOptions } from '@tanstack/react-query';
import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import type { Address, Chain } from 'viem';

/**
 * Note: exported as public Type
 */
export type AddressProps = {
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
export type AvatarProps = {
  /** The Ethereum address to fetch the avatar for. */
  address?: Address | null;
  /** Optional chain for domain resolution */
  chain?: Chain;
  /** Optional className override for top div element. */
  className?: string;
  /** Optional custom component to display while the avatar data is loading. */
  loadingComponent?: ReactNode;
  /** Optional custom component to display when no ENS name or avatar is available. */
  defaultComponent?: ReactNode;
  /** Optional attestation by passing Badge component as its children */
  children?: ReactNode;
} & ImgHTMLAttributes<HTMLImageElement>; /** Optional additional image attributes to apply to the avatar. */

/**
 * Note: exported as public Type
 */
export type BadgeProps = {
  /** Optional className override for top span element. */
  className?: string;
  /** Controls whether the badge shows a tooltip on hover. When true, the tooltip displays the attestation's name. When a string is provided, that text overrides the default display. Defaults to false. */
  tooltip?: boolean | string;
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
export type EthBalanceProps = {
  /** Ethereum address */
  address?: Address;
  /** Optional className override */
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type GetAddressParams = {
  /** Name to resolve */
  name: string | Basename;
  /** Optional chain for domain resolution */
  chain?: Chain;
};

/**
 * Note: exported as public Type
 */
export type GetAddressesParams = {
  /** Array of names to resolve addresses for */
  names: Array<string | Basename>;
};

/**
 * Note: exported as public Type
 */
export type GetAddressReturnType = Address | null;

/**
 * Note: exported as public Type
 */
export type GetAttestationsParams = {
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
export type GetAvatarParams = {
  /** The ENS or Basename to fetch the avatar for. */
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
export type GetAvatarsParams = {
  /** Array of ENS or Basenames to resolve avatars for */
  ensNames: string[];
  /** Optional chain for domain resolution */
  chain?: Chain;
};

/**
 * Note: exported as public Type
 */
export type GetNameParams = {
  /** Ethereum address to resolve */
  address?: Address;
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
export type GetNamesParams = {
  /** Array of Ethereum addresses to resolve names for */
  addresses: Address[];
  /** Optional chain for domain resolution */
  chain?: Chain;
};

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

export type IdentityProviderProps = {
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
export type IdentityProps = {
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
export type NameProps = {
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

export type UseAttestationsParams = {
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
export type UseAddressParams = {
  /** The ENS or Basename for which the Ethereum address is to be fetched */
  name: string | Basename;
  /** Optional chain for domain resolution */
  chain?: Chain;
};

/**
 * Note: exported as public Type
 */
export type UseAddressesParams = {
  /** Array of ENS or Basenames to resolve addresses for */
  names: Array<string | Basename>;
};

/**
 * Note: exported as public Type
 */
export type UseAvatarParams = {
  /** ENS name to resolve */
  ensName: string;
  /** Optional chain for domain resolution */
  chain?: Chain;
};

/**
 * Note: exported as public Type
 */
export type UseNameParams = {
  /** The address for which the ENS or Basename is to be fetched. */
  address?: Address;
  /** Optional chain for domain resolution */
  chain?: Chain;
};

/**
 * Note: exported as public Type
 */
export type UseNamesParams = {
  /** Array of addresses to resolve ENS or Basenames for */
  addresses: Address[];
  /** Optional chain for domain resolution */
  chain?: Chain;
};

/**
 * Note: exported as public Type
 */
export type UseAvatarsParams = {
  /** Array of ENS names to resolve avatars for */
  ensNames: string[];
  /** Optional chain for domain resolution */
  chain?: Chain;
};

/**
 * Note: exported as public Type
 *
 * Extends Tanstack Query's UseQueryOptions type but omits 'queryKey' and 'queryFn'
 * properties which are handled internally.
 *
 * This allows developers to pass any Tanstack Query option (like retry, refetchInterval,
 * select, onSuccess, etc.) to OnchainKit hooks while ensuring type safety.
 */
export type UseQueryOptions<TData = unknown> = Omit<
  TanstackUseQueryOptions<TData>,
  'queryKey' | 'queryFn'
> & {
  /**
   * @deprecated Use `gcTime` instead. Will be removed in a future version.
   * The time in milliseconds after data is considered stale before it is removed from the cache.
   */
  cacheTime?: number;
};
