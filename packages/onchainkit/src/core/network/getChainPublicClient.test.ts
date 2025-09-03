/**
 * @vitest-environment jsdom
 */

import { createPublicClient, http } from 'viem';
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
    vi.mocked(getOnchainKitConfig).mockImplementation((key) => {
      if (key === 'apiKey') return '123';
      if (key === 'defaultPublicClients') return null;
      return null;
    });
    const publicClient = getChainPublicClient(mainnet);
    expect(publicClient.chain.id).toBe(mainnet.id);
    // The transport uses the default RPC when http() is called without URL
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

  it('should return custom public client from defaultPublicClients when configured', async () => {
    // Create a mock custom public client
    const customPublicClient = createPublicClient({
      chain: base,
      transport: http('https://custom-rpc-url.com'),
    });

    // Mock getOnchainKitConfig to return defaultPublicClients with custom client
    vi.mocked(getOnchainKitConfig).mockImplementation((key) => {
      if (key === 'apiKey') return null;
      if (key === 'defaultPublicClients') {
        return {
          [base.id]: customPublicClient,
        };
      }
      return null;
    });

    const result = getChainPublicClient(base);
    expect(result).toBe(customPublicClient);
  });

  it('should fallback to default behavior when chain ID is not in defaultPublicClients', async () => {
    // Create a mock custom public client for mainnet only
    const customPublicClient = createPublicClient({
      chain: mainnet,
      transport: http('https://custom-mainnet-rpc.com'),
    });

    // Mock getOnchainKitConfig to return defaultPublicClients but without base chain
    vi.mocked(getOnchainKitConfig).mockImplementation((key) => {
      if (key === 'apiKey') return null;
      if (key === 'defaultPublicClients') {
        return {
          [mainnet.id]: customPublicClient, // Only mainnet configured
        };
      }
      return null;
    });

    // Request base chain which is not in defaultPublicClients
    const result = getChainPublicClient(base);
    
    // Should fallback to default public client
    expect(result).not.toBe(customPublicClient);
    expect(result.chain.id).toBe(base.id);
    expect(result.transport.url).toBe('https://mainnet.base.org');
  });
});
