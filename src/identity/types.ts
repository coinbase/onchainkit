import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import type { Address, Chain } from 'viem';

/**
 * Note: exported as public Type
 */
export type AddressReact = {
  address?: Address | null; // The Ethereum address to render.
  className?: string; // Optional className override for top span element.
  isSliced?: boolean; // Determines if the displayed address should be sliced.
  hasCopyAddressOnClick?: boolean; // Defaults to true. Optional boolean to disable copy address on click functionality.
};

/**
 * Note: exported as public Type
 */
export type AvatarReact = {
  address?: Address | null; // The Ethereum address to fetch the avatar for.
  chain?: Chain; // Optional chain for domain resolution
  className?: string; // Optional className override for top div element.
  loadingComponent?: JSX.Element; // Optional custom component to display while the avatar data is loading.
  defaultComponent?: JSX.Element; // Optional custom component to display when no ENS name or avatar is available.
  children?: ReactNode;
} & ImgHTMLAttributes<HTMLImageElement>; // Optional additional image attributes to apply to the avatar.

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
  twitter: string | null;
  github: string | null;
  farcaster: string | null;
  website: string | null;
};

/**
 * Note: exported as public Type
 */
export type EthBalanceReact = {
  address?: Address;
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type GetAddress = {
  name: string | Basename;
  chain?: Chain;
};

/**
 * Note: exported as public Type
 */
export type GetAddressReturnType = Address | null;

/**
 * Note: exported as public Type
 */
export type GetAvatar = {
  ensName: string; // The ENS name to fetch the avatar for.
  chain?: Chain; // Optional chain for domain resolution
};

/**
 * Note: exported as public Type
 */
export type GetAvatarReturnType = string | null;

/**
 * Note: exported as public Type
 */
export type GetName = {
  address: Address;
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
  address: Address; // The Ethereum address to fetch the avatar and name for.
  chain?: Chain; // Optional chain for domain resolution
};

export type IdentityProviderReact = {
  address?: Address;
  children: ReactNode;
  chain?: Chain;
};

/**
 * Note: exported as public Type
 */
export type IdentityReact = {
  address?: Address; // The Ethereum address to fetch the avatar and name for.
  chain?: Chain; // Optional chain for domain resolution
  children: ReactNode;
  className?: string; // Optional className override for top div element.
  hasCopyAddressOnClick?: boolean; // Optional boolean to disable copy address on click functionality.
};

/**
 * Note: exported as public Type
 */
export type NameReact = {
  address?: Address | null; // Ethereum address to be displayed.
  children?: ReactNode;
  chain?: Chain; // Optional chain for domain resolution
  className?: string; // Optional className override for top span element.
} & HTMLAttributes<HTMLSpanElement>; // Optional additional span attributes to apply to the name.

export type ResolverAddressesByChainIdMap = Record<number, Address>;

/**
 * Note: exported as public Type
 */
export type UseAddressOptions = {
  name: string | Basename; // The ENS or Basename for which the Ethereum address is to be fetched
  chain?: Chain; // Optional chain for domain resolution
};

/**
 * Note: exported as public Type
 */
export type UseAvatarOptions = {
  ensName: string;
  chain?: Chain; // Optional chain for domain resolution
};

/**
 * Note: exported as public Type
 */
export type UseQueryOptions = {
  enabled?: boolean;
  cacheTime?: number;
};

/**
 * Note: exported as public Type
 */
export type UseNameOptions = {
  address: Address; // The Ethereum address for which the ENS name is to be fetched.
  chain?: Chain; // Optional chain for domain resolution
};
