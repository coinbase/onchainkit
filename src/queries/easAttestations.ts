import { gql } from 'graphql-request';
import type { Address, Chain } from 'viem';
import { getAddress } from 'viem';
import { EASSchemaUid, EASAttestation } from '../identity/types';
import { createEasGraphQLClient } from '../network/createEasGraphQLClient';

/**
 * Type representing the filter options used for querying EAS Attestations.
 * @typedef {Object} GetEASAttestationQueryVariablesFilters
 * @property {number} [expirationTime] - Optional Unix timestamp to filter attestations based on expiration time.
 * @property {number} [limit] - Optional limit for the number of results returned.
 * @property {boolean} [revoked] - Optional boolean to filter attestations based on their revoked status.
 * @property {EASSchemaUid[]} [schemas] - Optional array of schema UIDs to filter attestations.
 */
type GetEASAttestationQueryVariablesFilters = {
  expirationTime?: number;
  limit: number;
  revoked: boolean;
  schemas?: EASSchemaUid[];
};

/**
 * Alias type for filter options when fetching attestations by filter.
 */
export type GetEASAttestationsByFilterOptions = GetEASAttestationQueryVariablesFilters;

/**
 * Type representing the variables passed to the EAS Attestations GraphQL query.
 * @typedef {Object} EASAttestationsQueryVariables
 * @property {string[]} distinct - Fields for which to get distinct records.
 * @property {number} take - Number of records to retrieve.
 * @property {Record<string, any>} where - Conditions for filtering the attestations.
 */
export type EASAttestationsQueryVariables = {
  distinct: string[];
  take: number;
  where: Record<string, any>;
};

/**
 * Type representing the response of the EAS Attestation GraphQL query.
 * @typedef {Object} GetEASAttestationQueryResponse
 * @property {EASAttestation[]} attestations - Array of attestation objects.
 */
export type GetEASAttestationQueryResponse = {
  attestations: EASAttestation[];
};

/**
 * Type representing the response when fetching attestations by filter.
 */
export type GetEASAttestationsByFilterResponse = EASAttestation[];

/**
 * GraphQL query definition for fetching EAS Attestations for users.
 */
export const easAttestationQuery = gql`
  query EASAttestationsForUsers(
    $where: AttestationWhereInput
    $distinct: [AttestationScalarFieldEnum!]
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
 * Generates query variables for the EAS Attestation GraphQL query based on the given address and filters.
 *
 * @param {Address} address - The Ethereum address of the recipient.
 * @param {GetEASAttestationQueryVariablesFilters} filters - Filters to apply to the query.
 * @returns {EASAttestationsQueryVariables} The query variables for the GraphQL query.
 */
export function getEASAttestationQueryVariables(
  address: Address,
  filters: GetEASAttestationQueryVariablesFilters,
): EASAttestationsQueryVariables {
  const checksummedAddress = getAddress(address);
  const conditions: Record<string, any> = {
    recipient: { equals: checksummedAddress },
    revoked: { equals: filters.revoked },
  };

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

/**
 * Fetches Ethereum Attestation Service (EAS) attestations for a given address and chain,
 * optionally filtered by the provided filter options.
 *
 * @param {Address} address - The Ethereum address for which attestations are being queried.
 * @param {Chain} chain - The blockchain chain of interest.
 * @param {GetEASAttestationsByFilterOptions} filters - Filter options for querying attestations.
 * @returns {Promise<GetEASAttestationsByFilterResponse>} A promise that resolves to an array of EAS Attestations.
 */
export async function getEASAttestationsByFilter<TChain extends Chain>(
  address: Address,
  chain: TChain,
  filters: GetEASAttestationsByFilterOptions,
): Promise<GetEASAttestationsByFilterResponse> {
  const easGraphqlClient = createEasGraphQLClient(chain);
  const easAttestationQueryVariables = getEASAttestationQueryVariables(address, filters);

  const { attestations } = await easGraphqlClient.request<
    GetEASAttestationQueryResponse,
    EASAttestationsQueryVariables
  >(easAttestationQuery, easAttestationQueryVariables);

  return attestations;
}
