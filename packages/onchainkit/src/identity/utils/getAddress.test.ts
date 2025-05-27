import { publicClient } from '@/core/network/client';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getAddress } from './getAddress';

vi.mock('@/core/network/client');

vi.mock('@/core/network/getChainPublicClient', () => ({
  ...vi.importActual('@/core/network/getChainPublicClient'),
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
  });

  it('should return null if address is not found', async () => {
    const name = 'test.ens';
    mockGetEnsAddress.mockResolvedValue(null);
    const address = await getAddress({ name });
    expect(address).toBeNull();
    expect(mockGetEnsAddress).toHaveBeenCalledWith({ name });
  });

  it('should resolve basename correctly', async () => {
    const name = 'shrek.base.eth';
    const expectedAddress = '0x1234';
    mockGetEnsAddress.mockResolvedValue(expectedAddress);
    const address = await getAddress({ name });
    expect(address).toBe(expectedAddress);
    expect(mockGetEnsAddress).toHaveBeenCalledWith({ name });
  });
});
