import type { ReactNode } from 'react';
import type { Address, Chain } from 'viem';

/**
 * Note: exported as public Type
 */
export type AvatarReact = {
  address?: Address | null; // The Ethereum address to fetch the avatar for.
  className?: string; // Optional additional CSS class to apply to the avatar.
  loadingComponent?: JSX.Element; // Optional custom component to display while the avatar data is loading.
  defaultComponent?: JSX.Element; // Optional custom component to display when no ENS name or avatar is available.
  props?: React.ImgHTMLAttributes<HTMLImageElement>; // Optional additional image attributes to apply to the avatar.
  showAttestation?: boolean; // Optional flag to show the EAS attestation badge.
};

/**
 * Note: exported as public Type
 */
export type BadgeReact = {
  backgroundColor?: string; // The background color of the badge.
  borderColor?: string; // The border color of the badge.
  className?: string; // // Optional additional CSS class to apply to the badge.
  tickerColor?: string; // The color of the checkmark.
};

/**
 * Ethereum Attestation Service (EAS) Schema Uid
 * The schema identifier associated with the EAS attestation.
 *
 * Note: exported as public Type
 */
export type EASSchemaUid = `0x${string}`;

/**
 * Ethereum Attestation Service (EAS) Attestation
 * GraphQL response for EAS Attestation
 *
 * Note: exported as public Type
 */
export type Attestation = {
  attester: Address; // the attester who created the attestation.
  decodedDataJson: string; // The attestation data decoded to JSON.
  expirationTime: number; // The Unix timestamp when the attestation expires (0 for no expiration).
  id: string; // The unique identifier of the attestation.
  recipient: Address; // The Ethereum address of the recipient of the attestation.
  revocationTime: number; // The Unix timestamp when the attestation was revoked, if applicable.
  revoked: boolean; // A boolean indicating whether the attestation is revoked or not.
  schemaId: EASSchemaUid; // The schema identifier associated with the attestation.
  time: number; // The Unix timestamp when the attestation was created.
};

/**
 * Ethereum Attestation Service (EAS) Chain Definition
 * The definition of a blockchain chain supported by EAS attestations.
 *
 * Note: exported as public Type
 */
export type EASChainDefinition = {
  easGraphqlAPI: string; // EAS GraphQL API endpoint
  id: number; // blockchain source id
  schemaUids: EASSchemaUid[]; // Array of EAS Schema UIDs
};

/**
 * Attestation Options
 *
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
  ensName: string; // The ENS name to fetch the avatar for.
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
  showAddress?: boolean;
};

/**
 * Note: exported as public Type
 */
export type GetNameReturnType = string | null;

/**
 * Note: exported as public Type
 */
export type IdentityContextType = {
  address: Address; // The Ethereum address to fetch the avatar and name for.
};

/**
 * Note: exported as public Type
 */
export type IdentityReact = {
  address: Address; // The Ethereum address to fetch the avatar and name for.
  children: ReactNode;
};

/**
 * Note: exported as public Type
 */
export type NameReact = {
  address: Address; // Ethereum address to be displayed.
  className?: string; // Optional CSS class for custom styling.
  props?: React.HTMLAttributes<HTMLSpanElement>; // Additional HTML attributes for the span element.
  showAddress?: boolean; // Whether to prefer to show the address instead of the ENS name.
  showAttestation?: boolean; // Optional flag to show the EAS attestation badge.
  sliced?: boolean; // Determines if the address should be sliced when no ENS name is available.
};

export type UseAttestations = {
  address: Address;
  chain: Chain;
  schemaId: Address;
};

export type WithAvatarBadgeInnerReact = {
  children: React.ReactNode;
  address: Address;
};

export type WithAvatarBadgeReact = {
  children: React.ReactNode;
  showAttestation: boolean;
  address: Address;
};

export type WithNameBadgeInnerReact = {
  children: React.ReactNode;
  address: Address;
};

export type WithNameBadgeReact = {
  children: React.ReactNode;
  showAttestation?: boolean;
  address: Address;
};
