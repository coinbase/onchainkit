import { GraphQLClient } from 'graphql-request';
import type { Chain } from 'viem';
import { getChainEASGraphQLAPI } from '../utils/easAttestation'; // Adjust the import path as needed

export function createEasGraphQLClient(chain: Chain): GraphQLClient {
    const endpoint = getChainEASGraphQLAPI(chain);
    return new GraphQLClient(endpoint);
}
