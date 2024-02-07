import type { Address } from 'viem';
import type { Chain } from 'viem';
import { gql, request } from 'graphql-request';
import { Attestation, AttestationSchema } from './types';
import { getChainSchemasUids, easScanGraphQLAPI, getAttesterAddresses } from './attestation';

const attestationsQuery = gql`
  query AttestationsForUsers(
    $where: AttestationWhereInput
    $orderBy: [AttestationOrderByWithRelationInput!]
    $distinct: [AttestationScalarFieldEnum!]
    $take: Int
  ) {
    attestations(where: $where, orderBy: $orderBy, distinct: $distinct, take: $take) {
      attester
      expirationTime
      id
      recipient
      revocationTime
      schemaId
      timeCreated
      txid
    }
  }
`;

/**
 * Retrieves attestations for a given address and chain, optionally filtered by schemas.
 *
 * @param chain - The blockchain of interest.
 * @param address - The address for which attestations are being queried.
 * @param filters - Optional filters including schemas to further refine the query.
 * @returns A promise that resolves to an array of Attestations.
 * @throws Will throw an error if the request to the GraphQL API fails.
 */
export async function getAttestation(
  chain: Chain,
  address: Address,
  filters?: { schemas?: AttestationSchema[] },
): Promise<Attestation[]> {
  try {
    const conditions: Record<string, any> = {
      attester: { in: getAttesterAddresses(chain) },
      recipient: { equals: address },
      revoked: { equals: false }, // Not revoked
      OR: [
        { expirationTime: { equals: 0 } },
        { expirationTime: { gt: Math.round(Date.now() / 1000) } },
      ], // Not expired
    };

    if (filters?.schemas?.length) {
      conditions.schemaId = { in: getChainSchemasUids(filters.schemas, chain.id) };
    }

    const variables = {
      where: { AND: [conditions] },
      orderBy: [{ timeCreated: 'desc' }],
      distinct: ['schemaId', 'attester'],
      take: 10,
    };

    const data: { attestations: Attestation[] } = await request(
      easScanGraphQLAPI,
      attestationsQuery,
      variables,
    );
    return data?.attestations || [];
  } catch (error) {
    console.error(`Error in getAttestation: ${(error as Error).message}`);
    throw error;
  }
}
