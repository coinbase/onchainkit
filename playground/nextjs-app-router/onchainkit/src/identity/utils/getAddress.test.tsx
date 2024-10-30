import { base, baseSepolia, mainnet } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { publicClient } from '../../network/client';
import { getChainPublicClient } from '../../network/getChainPublicClient';
import { getAddress } from './getAddress';

vi.mock('../../network/client');

vi.mock('../../network/getChainPublicClient', () => ({
  ...vi.importActual('../../network/getChainPublicClient'),
  getChainPublicClient: vi.fn(() => publicClient),
}));

describe('getAddress', () => {
  const mockGetEnsAddress = publicClient.getEnsAddress as Mock;
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return correct address', async () => {
    const name = 'test.ens';
    const expectedAddress = '0x1234';
    mockGetEnsAddress.mockResolvedValue(expectedAddress);
    const address = await getAddress({ name });
    expect(address).toBe(expectedAddress);
    expect(mockGetEnsAddress).toHaveBeenCalledWith({ name });
    expect(getChainPublicClient).toHaveBeenCalledWith(mainnet);
  });

  it('should resolve to base mainnet address', async () => {
    const name = 'shrek.base.eth';
    const expectedAddress = '0x1234';
    mockGetEnsAddress.mockResolvedValue(expectedAddress);
    const address = await getAddress({ name, chain: base });
    expect(address).toBe(expectedAddress);
    expect(getChainPublicClient).toHaveBeenCalledWith(base);
    expect(getChainPublicClient).not.toHaveBeenCalledWith(mainnet);
  });

  it('should resolve to baseSepolia address', async () => {
    const name = 'shrek.base.eth';
    const expectedAddress = '0x1234';
    mockGetEnsAddress.mockResolvedValue(expectedAddress);
    const address = await getAddress({ name, chain: baseSepolia });
    expect(address).toBe(expectedAddress);
    expect(getChainPublicClient).toHaveBeenCalledWith(baseSepolia);
    expect(getChainPublicClient).not.toHaveBeenCalledWith(mainnet);
  });

  it('should return null if address is not found', async () => {
    const name = 'test.ens';
    mockGetEnsAddress.mockResolvedValue(null);
    const address = await getAddress({ name });
    expect(address).toBeNull();
    expect(mockGetEnsAddress).toHaveBeenCalledWith({ name });
    expect(getChainPublicClient).toHaveBeenCalledWith(mainnet);
  });
});
