import { GraphQLClient } from 'graphql-request';
import type { Chain } from 'viem';
import { getChainEASGraphQLAPI } from '../identity/easSupportedChains';

export function createEasGraphQLClient(chain: Chain): GraphQLClient {
  const endpoint = getChainEASGraphQLAPI(chain);
  return new GraphQLClient(endpoint);
}
