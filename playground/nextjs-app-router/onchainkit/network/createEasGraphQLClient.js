import { GraphQLClient } from 'graphql-request';
import { getChainEASGraphQLAPI } from '../identity/utils/easSupportedChains.js';
function createEasGraphQLClient(chain) {
  const endpoint = getChainEASGraphQLAPI(chain);
  return new GraphQLClient(endpoint);
}
export { createEasGraphQLClient };
//# sourceMappingURL=createEasGraphQLClient.js.map
