import { ReactNode, ImgHTMLAttributes, HTMLAttributes } from 'react';
import { Address, Chain } from 'viem';

/**
 * Note: exported as public Type
 */
type AddressReact = {
    address?: Address | null;
    className?: string;
    isSliced?: boolean;
};
/**
 * Ethereum Attestation Service (EAS) Attestation
 * GraphQL response for EAS Attestation
 *
 * Note: exported as public Type
 */
type Attestation = {
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
type AvatarReact = {
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
type BadgeReact = {
    className?: string;
};
/**
 * Note: exported as public Type
 */
type BaseMainnetName = `${string}.base.eth`;
/**
 * Note: exported as public Type
 */
type Basename = BaseMainnetName | BaseSepoliaName;
/**
 * Note: exported as public Type
 */
type BaseSepoliaName = `${string}.basetest.eth`;
/**
 * Ethereum Attestation Service (EAS) Schema Uid
 * The schema identifier associated with the EAS attestation.
 *
 * Note: exported as public Type
 */
type EASSchemaUid = `0x${string}`;
/**
 * Ethereum Attestation Service (EAS) Chain Definition
 * The definition of a blockchain chain supported by EAS attestations.
 *
 * Note: exported as public Type
 */
type EASChainDefinition = {
    easGraphqlAPI: string;
    id: number;
    schemaUids: EASSchemaUid[];
};
/**
 * Note: exported as public Type
 */
type EthBalanceReact = {
    address?: Address;
    className?: string;
};
/**
 * Note: exported as public Type
 */
type GetAddress = {
    name: string | Basename;
    chain?: Chain;
};
/**
 * Note: exported as public Type
 */
type GetAddressReturnType = Address | null;
/**
 * Note: exported as public Type
 */
type GetAttestationsOptions = {
    schemas?: EASSchemaUid[];
    revoked?: boolean;
    expirationTime?: number;
    limit?: number;
};
/**
 * Note: exported as public Type
 */
type GetAvatar = {
    ensName: string;
    chain?: Chain;
};
/**
 * Note: exported as public Type
 */
type GetAvatarReturnType = string | null;
/**
 * Note: exported as public Type
 */
type GetName = {
    address: Address;
    chain?: Chain;
};
/**
 * Note: exported as public Type
 */
type GetNameReturnType = string | Basename | null;
/**
 * Note: exported as public Type
 */
type IdentityContextType = {
    address: Address;
    chain?: Chain;
    schemaId?: Address | null;
};
/**
 * Note: exported as public Type
 */
type IdentityReact = {
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
type NameReact = {
    address?: Address | null;
    children?: ReactNode;
    chain?: Chain;
    className?: string;
} & HTMLAttributes<HTMLSpanElement>;
type UseAttestations = {
    address: Address;
    chain: Chain;
    schemaId: Address | null;
};
/**
 * Note: exported as public Type
 */
type UseAddressOptions = {
    name: string | Basename;
    chain?: Chain;
};
/**
 * Note: exported as public Type
 */
type UseAvatarOptions = {
    ensName: string;
    chain?: Chain;
};
/**
 * Note: exported as public Type
 */
type UseQueryOptions = {
    enabled?: boolean;
    cacheTime?: number;
};
/**
 * Note: exported as public Type
 */
type UseNameOptions = {
    address: Address;
    chain?: Chain;
};

export type { AddressReact as A, BadgeReact as B, EASSchemaUid as E, GetAddress as G, IdentityReact as I, NameReact as N, UseAddressOptions as U, AvatarReact as a, EthBalanceReact as b, GetAddressReturnType as c, GetAttestationsOptions as d, Attestation as e, GetAvatar as f, GetAvatarReturnType as g, GetName as h, GetNameReturnType as i, UseQueryOptions as j, UseAttestations as k, UseAvatarOptions as l, UseNameOptions as m, BaseMainnetName as n, Basename as o, BaseSepoliaName as p, EASChainDefinition as q, IdentityContextType as r };
