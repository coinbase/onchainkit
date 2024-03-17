import { base, baseSepolia, optimism, zora } from 'viem/chains';
import { getChainEASGraphQLAPI } from './easSupportedChains';

describe('easSupportedChains', () => {
  describe('getChainEASGraphQLAPI', () => {
    it('should return Base Chain EAS GraphQL API', async () => {
      const chainEASGraphQLAPI = getChainEASGraphQLAPI(base);
      expect(chainEASGraphQLAPI).toEqual('https://base.easscan.org/graphql');
    });

    it('should return Base Sepolia Chain EAS GraphQL API', async () => {
      const chainEASGraphQLAPI = getChainEASGraphQLAPI(baseSepolia);
      expect(chainEASGraphQLAPI).toEqual('https://base-sepolia.easscan.org/graphql');
    });

    it('should return Optimism Chain EAS GraphQL API', async () => {
      const chainEASGraphQLAPI = getChainEASGraphQLAPI(optimism);
      expect(chainEASGraphQLAPI).toEqual('https://optimism.easscan.org/graphql');
    });

    it('should return empty string when Chain EAS GraphQL API is not present', async () => {
      const chainEASGraphQLAPI = getChainEASGraphQLAPI(zora);
      expect(chainEASGraphQLAPI).toEqual('');
    });
  });
});
