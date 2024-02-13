import { gql } from 'graphql-request';
import type { Address, Chain } from 'viem';
import { EASAttestationsQueryVariables, EASSchemaName } from '../core/types';
import { getEASAttesterAddresses, getChainEASSchemasUids } from '../utils/easAttestation';

export const easAttestationQuery = gql`
    query EASAttestationsForUsers(
        $where: EASAttestationWhereInput
        $orderBy: [EASAttestationOrderByWithRelationInput!]
        $distinct: [EASAttestationScalarFieldEnum!]
        $take: Int
    ) {
        attestations(where: $where, orderBy: $orderBy, distinct: $distinct, take: $take) {
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

export function getEASAttestationQueryVariables(
  address: Address,
  chain: Chain,
  filters?: { schemas?: EASSchemaName[] }
): EASAttestationsQueryVariables {
  const conditions: Record<string, any> = {
    attester: { in: getEASAttesterAddresses(chain) },
    recipient: { equals: address },
    revoked: { equals: false },
    OR: [
      { expirationTime: { equals: 0 } },
      { expirationTime: { gt: Math.round(Date.now() / 1000) } },
    ],
  };

  if (filters?.schemas && filters.schemas.length > 0) {
    conditions.schemaId = { in: getChainEASSchemasUids(filters.schemas, chain.id) };
  }

  return {
    where: { AND: [conditions] },
    orderBy: [{ timeCreated: 'desc' }],
    distinct: ['schemaId', 'attester'],
    take: 10,
  };
}
