import * as react_jsx_runtime from 'react/jsx-runtime';
import { A as AddressReact, a as AvatarReact, B as BadgeReact, b as EthBalanceReact, I as IdentityReact, N as NameReact, G as GetAddress, c as GetAddressReturnType, d as GetAttestationsOptions, e as Attestation, f as GetAvatar, g as GetAvatarReturnType, h as GetName, i as GetNameReturnType, U as UseAddressOptions, j as UseQueryOptions, k as UseAttestations, l as UseAvatarOptions, m as UseNameOptions } from '../types-C9oyc1o7.js';
export { n as BaseMainnetName, p as BaseSepoliaName, o as Basename, q as EASChainDefinition, E as EASSchemaUid, r as IdentityContextType } from '../types-C9oyc1o7.js';
import { Address as Address$1, Chain } from 'viem';
import * as _tanstack_react_query_build_legacy_types from '@tanstack/react-query/build/legacy/types';
import 'react';

declare function Address({ address, className, isSliced, }: AddressReact): react_jsx_runtime.JSX.Element | null;

/**
 * Represents an Avatar component that displays either a loading indicator,
 * a default avatar, or a custom avatar based on Ethereum Name Service (ENS).
 */
declare function Avatar({ address, chain, className, defaultComponent, loadingComponent, children, ...props }: AvatarReact): react_jsx_runtime.JSX.Element | null;

/**
 * Badge component.
 */
declare function Badge({ className }: BadgeReact): react_jsx_runtime.JSX.Element;

declare function EthBalance({ address, className }: EthBalanceReact): react_jsx_runtime.JSX.Element | null;

declare function Identity({ address, chain, children, className, hasCopyAddressOnClick, schemaId, }: IdentityReact): react_jsx_runtime.JSX.Element;

/**
 * Name is a React component that renders the user name from an Ethereum address.
 */
declare function Name({ address, className, children, chain, ...props }: NameReact): react_jsx_runtime.JSX.Element | null;

type SocialsReact = {
    address?: Address$1 | null;
    ensName?: string;
    chain?: Chain;
    className?: string;
};
declare function Socials({ address, chain, className }: SocialsReact): react_jsx_runtime.JSX.Element | null;

declare const isBasename: (username: string) => boolean;

type IdentityCardReact = {
    address?: Address$1;
    chain?: Chain;
    className?: string;
    schemaId?: Address$1 | null;
};
declare function IdentityCard({ address, chain, className, schemaId, }: IdentityCardReact): react_jsx_runtime.JSX.Element;

/**
 * Get address from ENS name or Basename.
 */
declare const getAddress: ({ name, chain, }: GetAddress) => Promise<GetAddressReturnType>;

/**
 * Fetches Ethereum Attestation Service (EAS) attestations for a given address and chain,
 * optionally filtered by schemas associated with the attestation.
 */
declare function getAttestations(address: Address$1, chain: Chain, options?: GetAttestationsOptions): Promise<Attestation[]>;

/**
 * An asynchronous function to fetch the Ethereum Name Service (ENS)
 * avatar for a given Ethereum name. It returns the ENS name if it exists,
 * or null if it doesn't or in case of an error.
 */
declare const getAvatar: ({ ensName, chain, }: GetAvatar) => Promise<GetAvatarReturnType>;

/**
 * An asynchronous function to fetch the Ethereum Name Service (ENS)
 * name for a given Ethereum address. It returns the ENS name if it exists,
 * or null if it doesn't or in case of an error.
 */
declare const getName: ({ address, chain, }: GetName) => Promise<GetNameReturnType>;

declare const useAddress: ({ name, chain }: UseAddressOptions, queryOptions?: UseQueryOptions) => _tanstack_react_query_build_legacy_types.UseQueryResult<GetAddressReturnType, Error>;

/**
 * Fetches EAS Attestations for a given address, chain, and schemaId.
 */
declare function useAttestations({ address, chain, schemaId, }: UseAttestations): Attestation[];

/**
 * Gets an ensName and resolves the Avatar
 */
declare const useAvatar: ({ ensName, chain }: UseAvatarOptions, queryOptions?: UseQueryOptions) => _tanstack_react_query_build_legacy_types.UseQueryResult<GetAvatarReturnType, Error>;

/**
 * It leverages the `@tanstack/react-query` hook for fetching and optionally caching the ENS name
 * @returns An object containing:
 *  - `ensName`: The fetched ENS name for the provided address, or null if not found or in case of an error.
 *  - `{UseQueryResult}`: The rest of useQuery return values. including isLoading, isError, error, isFetching, refetch, etc.
 */
declare const useName: ({ address, chain }: UseNameOptions, queryOptions?: UseQueryOptions) => _tanstack_react_query_build_legacy_types.UseQueryResult<GetNameReturnType, Error>;

export { Address, AddressReact, Attestation, Avatar, AvatarReact, Badge, BadgeReact, EthBalance, EthBalanceReact, GetAddress, GetAddressReturnType, GetAttestationsOptions, GetAvatar, GetAvatarReturnType, GetName, GetNameReturnType, Identity, IdentityCard, IdentityReact, Name, NameReact, Socials, UseAddressOptions, UseAvatarOptions, UseNameOptions, UseQueryOptions, getAddress, getAttestations, getAvatar, getName, isBasename, useAddress, useAttestations, useAvatar, useName };
