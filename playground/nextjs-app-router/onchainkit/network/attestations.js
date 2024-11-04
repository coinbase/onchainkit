import { gql } from 'graphql-request';
import { getAddress } from 'viem';
import { createEasGraphQLClient } from './createEasGraphQLClient.js';

/**
 * Type representing the filter options used for querying EAS Attestations.
 * @typedef {Object} GetAttestationQueryVariablesFilters
 * @property {number} [expirationTime] - Optional Unix timestamp to filter attestations based on expiration time.
 * @property {number} [limit] - Optional limit for the number of results returned.
 * @property {boolean} [revoked] - Optional boolean to filter attestations based on their revoked status.
 * @property {EASSchemaUid[]} [schemas] - Optional array of schema UIDs to filter attestations.
 */

/**
 * Alias type for filter options when fetching attestations by filter.
 */

/**
 * Type representing the variables passed to the EAS Attestations GraphQL query.
 * @typedef {Object} AttestationsQueryVariables
 * @property {string[]} distinct - Fields for which to get distinct records.
 * @property {number} take - Number of records to retrieve.
 * @property {Record<string, any>} where - Conditions for filtering the attestations.
 */

/**
 * Type representing the response of the EAS Attestation GraphQL query.
 * @typedef {Object} GetAttestationQueryResponse
 * @property {Attestation[]} attestations - Array of attestation objects.
 */

/**
 * Type representing the response when fetching attestations by filter.
 */

/**
 * GraphQL query definition for fetching EAS Attestations for users.
 */
const attestationQuery = gql`
  query AttestationsForUsers(
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
 * @param {GetAttestationQueryVariablesFilters} filters - Filters to apply to the query.
 * @returns {AttestationsQueryVariables} The query variables for the GraphQL query.
 */
function getAttestationQueryVariables(address, filters) {
  const checksummedAddress = getAddress(address);
  /* biome-ignore lint: code needs to be deprecated */
  const conditions = {
    recipient: {
      equals: checksummedAddress
    },
    revoked: {
      equals: filters.revoked
    }
  };
  if (typeof filters.expirationTime === 'number') {
    conditions.OR = [{
      expirationTime: {
        equals: 0
      }
    }, {
      expirationTime: {
        gt: filters.expirationTime
      }
    }];
  }
  if (filters?.schemas && filters.schemas.length > 0) {
    conditions.schemaId = {
      in: filters.schemas
    };
  }
  return {
    where: {
      AND: [conditions]
    },
    distinct: ['schemaId'],
    take: filters.limit
  };
}

/**
 * Fetches Ethereum Attestation Service (EAS) attestations for a given address and chain,
 * optionally filtered by the provided filter options.
 *
 * @param {Address} address - The Ethereum address for which attestations are being queried.
 * @param {Chain} chain - The blockchain chain of interest.
 * @param {GetAttestationsByFilterOptions} filters - Filter options for querying attestations.
 * @returns {Promise<GetAttestationsByFilterResponse>} A promise that resolves to an array of EAS Attestations.
 */
async function getAttestationsByFilter(address, chain, filters) {
  const easGraphqlClient = createEasGraphQLClient(chain);
  const attestationQueryVariables = getAttestationQueryVariables(address, filters);
  const _await$easGraphqlClie = await easGraphqlClient.request(attestationQuery, attestationQueryVariables),
    attestations = _await$easGraphqlClie.attestations;
  return attestations;
}
export { attestationQuery, getAttestationQueryVariables, getAttestationsByFilter };
//# sourceMappingURL=attestations.js.map
