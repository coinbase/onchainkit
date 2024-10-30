/**
 * @vitest-environment jsdom
 */

import { arbitrum, base, mainnet, optimism } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { convertChainIdToCoinType } from './convertChainIdToCoinType';

describe('convertChainIdToCoinType', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // We test the chain listed on ENSIP-19 documentation https://docs.ens.domains/ensip/19#examples-of-valid-l2-reverse-resolution

  it('should return correct cointype for mainnet', async () => {
    const coinType = convertChainIdToCoinType(mainnet.id);
    expect(coinType).toBe('addr');
  });

  it('should return correct cointype for arbitrum', async () => {
    const coinType = convertChainIdToCoinType(arbitrum.id);
    expect(coinType).toBe('8000A4B1');
  });

  it('should return correct cointype for optimism', async () => {
    const coinType = convertChainIdToCoinType(optimism.id);
    expect(coinType).toBe('8000000A');
  });

  it('should return correct cointype for base', async () => {
    const coinType = convertChainIdToCoinType(base.id);
    expect(coinType).toBe('80002105');
  });
});
