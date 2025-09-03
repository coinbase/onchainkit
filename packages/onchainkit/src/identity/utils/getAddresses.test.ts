import { isBasename } from '@/identity/utils/isBasename';
import type { Address } from 'viem';
import { mainnet } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { getAddresses } from './getAddresses';
import { getChainPublicClient } from '../../core/network/getChainPublicClient';

vi.mock('@/identity/utils/isBasename', () => ({
  isBasename: vi.fn(),
}));

vi.mock('@/core/network/getChainPublicClient');

describe('getAddresses', () => {
  const testNames = ['user1.eth', 'user2.eth', 'user3.base.eth'];
  const testAddresses = [
    '0x1234567890123456789012345678901234567890',
    '0x2345678901234567890123456789012345678901',
    '0x3456789012345678901234567890123456789012',
  ] as Address[];

  const mockClient = {
    getEnsAddress: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getChainPublicClient).mockReturnValue(mockClient as any);
    vi.mocked(isBasename).mockImplementation(
      (name) => name.includes('.base.eth') || name.includes('.basetest.eth'),
    );
  });

  it('returns empty array when no names are provided', async () => {
    const addresses = await getAddresses({ names: [] });
    expect(addresses).toEqual([]);
  });

  it('fetches addresses for multiple ENS names', async () => {
    mockClient.getEnsAddress.mockImplementation((params) => {
      if (params.name === testNames[0])
        return Promise.resolve(testAddresses[0]);
      if (params.name === testNames[1])
        return Promise.resolve(testAddresses[1]);
      if (params.name === testNames[2])
        return Promise.resolve(testAddresses[2]);
      return Promise.resolve(null);
    });

    const addresses = await getAddresses({ names: testNames });

    expect(addresses).toEqual(testAddresses);
    expect(mockClient.getEnsAddress).toHaveBeenCalledTimes(3);
    testNames.forEach((name, index) => {
      const isBasenameName = isBasename(name);
      expect(mockClient.getEnsAddress).toHaveBeenNthCalledWith(index + 1, {
        name,
        universalResolverAddress: isBasenameName
          ? RESOLVER_ADDRESSES_BY_CHAIN_ID[mainnet.id]
          : undefined,
      });
    });
  });

  it('handles partial failures in address resolution', async () => {
    mockClient.getEnsAddress.mockImplementation((params) => {
      if (params.name === testNames[0])
        return Promise.resolve(testAddresses[0]);
      if (params.name === testNames[1])
        return Promise.reject(new Error('Resolution failed'));
      if (params.name === testNames[2])
        return Promise.resolve(testAddresses[2]);
      return Promise.resolve(null);
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const addresses = await getAddresses({ names: testNames });

    expect(addresses).toEqual([testAddresses[0], null, testAddresses[2]]);
    expect(consoleSpy).toHaveBeenCalled();
    expect(mockClient.getEnsAddress).toHaveBeenCalledTimes(3);

    consoleSpy.mockRestore();
  });

  it('handles errors in batch resolution process', async () => {
    mockClient.getEnsAddress.mockImplementation(() => {
      throw new Error('Batch resolution failed');
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const addresses = await getAddresses({ names: testNames });

    expect(addresses).toEqual([null, null, null]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error resolving addresses in batch:',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it('handles null result in names array', async () => {
    const namesWithNull = ['user1.eth', null, 'user3.eth'];

    mockClient.getEnsAddress.mockImplementation((params) => {
      if (params.name === 'user1.eth') return Promise.resolve(testAddresses[0]);
      if (params.name === 'user3.eth') return Promise.resolve(testAddresses[2]);
      return Promise.resolve(null);
    });

    const addresses = await getAddresses({ names: namesWithNull as string[] });

    expect(addresses).toEqual([testAddresses[0], null, testAddresses[2]]);
    expect(mockClient.getEnsAddress).toHaveBeenCalledTimes(2);
  });

  it('returns array of nulls when all names are null or undefined', async () => {
    const allNullNames = [null, undefined, null] as unknown as string[];

    const addresses = await getAddresses({ names: allNullNames });

    expect(addresses).toEqual([null, null, null]);
    expect(mockClient.getEnsAddress).not.toHaveBeenCalled();
  });
});
