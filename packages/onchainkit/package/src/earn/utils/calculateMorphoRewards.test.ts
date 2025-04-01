import type { MorphoVaultApiResponse } from '@/earn/utils/fetchMorphoApy';
import { describe, expect, it } from 'vitest';
import calculateMorphoRewards from './calculateMorphoRewards';

const mockState: MorphoVaultApiResponse['data']['vaultByAddress']['state'] = {
  id: '1',
  apy: 0.1,
  totalAssets: 1000,
  totalAssetsUsd: 1000,
  fee: 0.01,
  timelock: 0,
  netApy: 0.1,
  netApyWithoutRewards: 0.05,
  rewards: [
    {
      supplyApr: 0.02,
      amountPerSuppliedToken: '0.02',
      yearlySupplyTokens: '0.02',
      asset: { address: '0x1', name: 'Asset 1', decimals: 18 },
    },
    {
      supplyApr: 0.01,
      amountPerSuppliedToken: '0.01',
      yearlySupplyTokens: '0.01',
      asset: { address: '0x2', name: 'Asset 2', decimals: 18 },
    },
  ],
};

describe('calculateMorphoRewards', () => {
  it('calculates Morpho rewards correctly', () => {
    // Expected: netApy - (netApyWithoutRewards + sum of rewards)
    // 10% - (5% + 3%) = 2%
    const result = calculateMorphoRewards(mockState);
    expect(result).toBeCloseTo(0.02, 4); // formatting handled elsewhere
  });

  it('handles case with no rewards', () => {
    const noRewardsState = {
      ...mockState,
      netApy: 0.1,
      netApyWithoutRewards: 0.1,
      rewards: [],
    };

    const result = calculateMorphoRewards(noRewardsState);
    expect(result).toBe(0);
  });
});
