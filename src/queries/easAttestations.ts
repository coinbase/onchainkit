import { gql } from 'graphql-request';
import type { Address } from 'viem';
import { EASSchemaUid, EASAttestation } from '../core/types';


/**
 * Type for the input filters to the GraphQL query.
 * @typedef {Object} GetEASAttestationQueryVariablesFilters
 * @property {EASSchemaUid[]} [schemas] - Optional array of schema UIDs to filter attestations.
 * @property {boolean} [revoked] - Optional boolean to filter attestations based on their revoked status.
 * @property {number} [expirationTime] - Optional Unix timestamp to filter attestations based on expiration time.
 * @property {number} [limit] - Optional limit for the number of results returned.
 */
type GetEASAttestationQueryVariablesFilters = {
    schemas?: EASSchemaUid[];
    revoked: boolean;
    expirationTime?: number;
    limit: number;
};

/**
 * Type for the variables passed to the GraphQL query.
 * @typedef {Object} EASAttestationsQueryVariables
 * @property {Record<string, any>} where - Conditions for filtering the attestations.
 * @property {string[]} distinct - Fields for which to get distinct records.
 * @property {number} take - Number of records to retrieve.
 */
export type EASAttestationsQueryVariables = {
    where: Record<string, any>;
    distinct: string[];
    take: number;
};

/**
 * Type for the response of the GraphQL query.
 * @typedef {Object} GetEASAttestationQueryResponse
 * @property {EASAttestation[]} attestations - Array of attestation objects.
 */
export type GetEASAttestationQueryResponse = {
    attestations: EASAttestation[];
};

/**
 * GraphQL query definition for fetching EAS Attestations for users.
 */
export const easAttestationQuery = gql`
    query EASAttestationsForUsers(
        $where: EASAttestationWhereInput
        $distinct: [EASAttestationScalarFieldEnum!]
        $take: Int
    ) {
        attestations(where: $where, distinct: $distinct, take: $take) {
            id
            txid
            schemaId
            attester
            recipient
            revoked
            revocationTime
            expirationTime
            time
            timeCreated
            decodedDataJson
        }
    }
`;

/**
 * Generates query variables for the EAS Attestation GraphQL query.
 * 
 * @param {Address} address - The Ethereum address of the recipient.
 * @param {GetEASAttestationQueryVariablesFilters} [filters] - Optional filters to apply to the query.
 * @returns {EASAttestationsQueryVariables} The query variables for the GraphQL query.
 */
export function getEASAttestationQueryVariables(
  address: Address,
  filters: GetEASAttestationQueryVariablesFilters,
): EASAttestationsQueryVariables {
  const conditions: Record<string, any> = {
    recipient: { equals: address },
    revoked: { equals: filters.revoked },
  };
    
  // Handle the expiration time if passed as filter
  if (typeof filters.expirationTime === 'number') {
    conditions.OR = [
      { expirationTime: { equals: 0 } },
      { expirationTime: { gt: filters.expirationTime } },
    ];
  }

  if (filters?.schemas && filters.schemas.length > 0) {
    conditions.schemaId = { in: filters.schemas };
  }

  return {
    where: { AND: [conditions] },
    distinct: ['schemaId'],
    take: filters.limit,
  };
}
