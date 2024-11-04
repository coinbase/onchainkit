import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import type { Address, Chain } from 'viem';
/**
 * Note: exported as public Type
 */
export type AddressReact = {
    address?: Address | null;
    className?: string;
    isSliced?: boolean;
    hasCopyAddressOnClick?: boolean;
};
/**
 * Ethereum Attestation Service (EAS) Attestation
 * GraphQL response for EAS Attestation
 *
 * Note: exported as public Type
 */
export type Attestation = {
    attester: Address;
    decodedDataJson: string;
    expirationTime: number;
    id: string;
    recipient: Address;
    revocationTime: number;
    revoked: boolean;
    schemaId: EASSchemaUid;
    time: number;
};
/**
 * Note: exported as public Type
 */
export type AvatarReact = {
    address?: Address | null;
    chain?: Chain;
    className?: string;
    loadingComponent?: JSX.Element;
    defaultComponent?: JSX.Element;
    children?: ReactNode;
} & ImgHTMLAttributes<HTMLImageElement>;
/**
 * Note: exported as public Type
 */
export type BadgeReact = {
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
    twitter: string | null;
    github: string | null;
    farcaster: string | null;
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
    easGraphqlAPI: string;
    id: number;
    schemaUids: EASSchemaUid[];
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
export type GetAttestationsOptions = {
    schemas?: EASSchemaUid[];
    revoked?: boolean;
    expirationTime?: number;
    limit?: number;
};
/**
 * Note: exported as public Type
 */
export type GetAvatar = {
    ensName: string;
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
    address: Address;
    chain?: Chain;
    schemaId?: Address | null;
};
export type IdentityProviderReact = {
    address?: Address;
    children: ReactNode;
    schemaId?: Address | null;
    chain?: Chain;
};
/**
 * Note: exported as public Type
 */
export type IdentityReact = {
    address?: Address;
    chain?: Chain;
    children: ReactNode;
    className?: string;
    schemaId?: Address | null;
    hasCopyAddressOnClick?: boolean;
};
/**
 * Note: exported as public Type
 */
export type NameReact = {
    address?: Address | null;
    children?: ReactNode;
    chain?: Chain;
    className?: string;
} & HTMLAttributes<HTMLSpanElement>;
export type ResolverAddressesByChainIdMap = Record<number, Address>;
export type UseAttestations = {
    address: Address;
    chain: Chain;
    schemaId: Address | null;
};
/**
 * Note: exported as public Type
 */
export type UseAddressOptions = {
    name: string | Basename;
    chain?: Chain;
};
/**
 * Note: exported as public Type
 */
export type UseAvatarOptions = {
    ensName: string;
    chain?: Chain;
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
    address: Address;
    chain?: Chain;
};
//# sourceMappingURL=types.d.ts.map