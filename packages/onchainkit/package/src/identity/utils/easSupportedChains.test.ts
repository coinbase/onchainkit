import { base, baseSepolia, optimism, zora } from 'viem/chains';
import { describe, expect, it } from 'vitest';
import { getChainEASGraphQLAPI } from './easSupportedChains';

describe('easSupportedChains', () => {
  describe('getChainEASGraphQLAPI', () => {
    it('should return Base Chain EAS GraphQL API', async () => {
      const chainEasGraphQlapi = getChainEASGraphQLAPI(base);
      expect(chainEasGraphQlapi).toEqual('https://base.easscan.org/graphql');
    });

    it('should return Base Sepolia Chain EAS GraphQL API', async () => {
      const chainEasGraphQlapi = getChainEASGraphQLAPI(baseSepolia);
      expect(chainEasGraphQlapi).toEqual(
        'https://base-sepolia.easscan.org/graphql',
      );
    });

    it('should return Optimism Chain EAS GraphQL API', async () => {
      const chainEasGraphQlapi = getChainEASGraphQLAPI(optimism);
      expect(chainEasGraphQlapi).toEqual(
        'https://optimism.easscan.org/graphql',
      );
    });

    it('should return empty string when Chain EAS GraphQL API is not present', async () => {
      const chainEasGraphQlapi = getChainEASGraphQLAPI(zora);
      expect(chainEasGraphQlapi).toEqual('');
    });
  });
});
