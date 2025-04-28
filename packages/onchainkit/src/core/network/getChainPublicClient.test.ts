/**
 * @vitest-environment jsdom
 */

import { base, baseSepolia, mainnet } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getChainPublicClient } from './getChainPublicClient';
import { getOnchainKitConfig } from '../OnchainKitConfig';

vi.mock('../OnchainKitConfig', () => ({
  getOnchainKitConfig: vi.fn(),
}));

describe('getChainPublicClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a public client matching the given chain', async () => {
    const publicClient = getChainPublicClient(base);
    expect(publicClient.chain.id).toBe(base.id);
  });

  it('should use public RPC URL when no API key is provided', async () => {
    vi.mocked(getOnchainKitConfig).mockReturnValue(null);
    const publicClient = getChainPublicClient(base);
    expect(publicClient.transport.url).toBe('https://mainnet.base.org');
  });

  it('should use public RPC URL when chain is not base or baseSepolia', async () => {
    vi.mocked(getOnchainKitConfig).mockReturnValue('123');
    const publicClient = getChainPublicClient(mainnet);
    expect(publicClient.transport.url).toBe('https://eth.merkle.io');
  });

  it('should use user-provided RPC URL when an API key is provided and the chain is base or baseSepolia', async () => {
    vi.mocked(getOnchainKitConfig).mockReturnValue(null);
    const publicClient = getChainPublicClient(base);
    expect(publicClient.transport.url).toBe('https://mainnet.base.org');

    vi.mocked(getOnchainKitConfig).mockReturnValue('123');
    const publicClientWithCustomRpc = getChainPublicClient(base);
    expect(publicClientWithCustomRpc.transport.url).toBe(
      'https://api.developer.coinbase.com/rpc/v1/base/123',
    );

    vi.mocked(getOnchainKitConfig).mockReturnValue('123');
    const publicSepoliaClientWithCustomRpc = getChainPublicClient(baseSepolia);
    expect(publicSepoliaClientWithCustomRpc.transport.url).toBe(
      'https://api.developer.coinbase.com/rpc/v1/base-sepolia/123',
    );
  });
});
