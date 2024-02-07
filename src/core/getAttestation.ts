import type { Address } from "viem";
import { gql, request } from "graphql-request";
import { Attestation, AttestationSchema } from "./types";
import { schemasToUids, client, indexApi, attesterAddresses } from './attestation';

const attestationsQuery = gql`
  query AttestationsForUsers(
    $where: AttestationWhereInput
    $orderBy: [AttestationOrderByWithRelationInput!]
    $distinct: [AttestationScalarFieldEnum!]
    $take: Int
  ) {
    attestations(
      where: $where
      orderBy: $orderBy
      distinct: $distinct
      take: $take
    ) {
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

export async function getAttestation(
    address: Address,
    filters?: { schemas?: AttestationSchema[] }
): Promise<Attestation[]> {
    
    let conditions: any = {
        attester: {
            in: attesterAddresses[client.chain?.id],
        },
        recipient: {
            equals: address,
        },
        // Not revoked
        revoked: {
            equals: false,
        },
        OR: [
            {
                // No expiration
                expirationTime: {
                    equals: 0,
                },
            },
            {
                // Not expired
                expirationTime: {
                    gt: Math.round(Date.now() / 1000),
                },
            },
        ],
    };
    
    if (filters?.schemas?.length && filters?.schemas?.length > 0) {
        conditions.schemaId = {
            in: schemasToUids(filters.schemas, client.chain?.id),
        };
    }

    const variables = {
        where: {
            AND: [conditions],
        },
        orderBy: [
            {
                timeCreated: "desc",
            },
        ],
        distinct: ["schemaId", "attester"],
        take: 10,
    };
    const data: any = await request(
        indexApi,
        attestationsQuery,
        variables,
    );
    return data?.attestations || [];
}
