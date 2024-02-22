import { Address } from 'viem';

/**
 * Ethereum Attestation Service (EAS) Attester Address
 * The Ethereum address of the attester who created the attestation.
 */
type EASAttesterAddress = Address;

/**
 * Ethereum Attestation Service (EAS) Schema Uid
 * The schema identifier associated with the EAS attestation.
 *
 * Note: exported as public Type
 */
export type EASSchemaUid = Address;

/**
 * Ethereum Attestation Service (EAS) Attestation
 * GraphQL response for EAS Attestation
 *
 * Note: exported as public Type
 */
export type EASAttestation = {
  attester: EASAttesterAddress; // the attester who created the attestation.
  decodedDataJson: string; // The attestation data decoded to JSON.
  expirationTime: number; // The Unix timestamp when the attestation expires (0 for no expiration).
  id: string; // The unique identifier of the attestation.
  recipient: Address; // The Ethereum address of the recipient of the attestation.
  revocationTime: number; // The Unix timestamp when the attestation was revoked, if applicable.
  revoked: boolean; // A boolean indicating whether the attestation is revocable or not.
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
