import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAddress } from './getAddress';
import { getChainPublicClient } from '../../core/network/getChainPublicClient';

vi.mock('@/core/network/getChainPublicClient');

describe('getAddress', () => {
  const mockClient = {
    getEnsAddress: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(getChainPublicClient).mockReturnValue(mockClient as any);
  });

  it('should return correct address', async () => {
    const name = 'test.ens';
    const expectedAddress = '0x1234';
    mockClient.getEnsAddress.mockResolvedValue(expectedAddress);
    const address = await getAddress({ name });
    expect(address).toBe(expectedAddress);
    expect(mockClient.getEnsAddress).toHaveBeenCalledWith({ name });
  });

  it('should return null if address is not found', async () => {
    const name = 'test.ens';
    mockClient.getEnsAddress.mockResolvedValue(null);
    const address = await getAddress({ name });
    expect(address).toBeNull();
    expect(mockClient.getEnsAddress).toHaveBeenCalledWith({ name });
  });

  it('should resolve basename correctly', async () => {
    const name = 'shrek.base.eth';
    const expectedAddress = '0x1234';
    mockClient.getEnsAddress.mockResolvedValue(expectedAddress);
    const address = await getAddress({ name });
    expect(address).toBe(expectedAddress);
    expect(mockClient.getEnsAddress).toHaveBeenCalledWith({ name });
  });
});
