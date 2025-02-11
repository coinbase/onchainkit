import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchMorphoApy } from './fetchMorphoApy';
import type { MorphoVaultApiResponse } from './fetchMorphoApy';

const mockVaultResponse: MorphoVaultApiResponse = {
  data: {
    vaultByAddress: {
      address: '0x1234567890123456789012345678901234567890',
      symbol: 'mUSDC',
      name: 'Morpho USDC Vault',
      creationBlockNumber: 1234567,
      creationTimestamp: 1234567890,
      creatorAddress: '0x0987654321098765432109876543210987654321',
      whitelisted: true,
      asset: {
        id: 'usdc-1',
        address: '0xabcdef0123456789abcdef0123456789abcdef01',
        decimals: 6,
        symbol: 'USDC',
      },
      chain: {
        id: 8453,
        network: 'base',
      },
      liquidity: {
        underlying: '1000',
      },
      state: {
        id: 'state-1',
        apy: 0.05,
        netApy: 0.045,
        netApyWithoutRewards: 0.04,
        totalAssets: 1000000,
        totalAssetsUsd: 1000000,
        fee: 0.1,
        timelock: 86400,
        rewards: [
          {
            amountPerSuppliedToken: '0.001',
            supplyApr: 0.01,
            yearlySupplyTokens: '1000',
            asset: {
              address: '0xdef0123456789abcdef0123456789abcdef0123',
              name: 'Reward Token',
              decimals: 18,
            },
          },
        ],
      },
    },
  },
};

describe('fetchMorphoApy', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('fetches and returns vault data correctly', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockVaultResponse),
    });

    const vaultAddress = '0x1234567890123456789012345678901234567890';
    const result = await fetchMorphoApy(vaultAddress);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://blue-api.morpho.org/graphql',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    expect(result).toEqual(mockVaultResponse.data.vaultByAddress);
  });

  it('handles API errors', async () => {
    (global.fetch as Mock).mockRejectedValueOnce(new Error('API Error'));

    const vaultAddress = '0x1234567890123456789012345678901234567890';
    await expect(fetchMorphoApy(vaultAddress)).rejects.toThrow('API Error');
  });

  it('handles malformed response', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ data: null }),
    });

    const vaultAddress = '0x1234567890123456789012345678901234567890';
    await expect(fetchMorphoApy(vaultAddress)).rejects.toThrow();
  });
});
