import { Address } from 'viem';

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
export type EASAttestation = {
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
export type GetEASAttestationsOptions = {
  schemas?: EASSchemaUid[];
  revoked?: boolean;
  expirationTime?: number;
  limit?: number;
};
