import { publicClient } from '@/core/network/client';
import type { Address } from 'viem';
import { base, mainnet, optimism } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import L2ResolverAbi from '../abis/L2ResolverAbi';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { convertReverseNodeToBytes } from './convertReverseNodeToBytes';
import { getAddress } from './getAddress';
import { getAddresses } from './getAddresses';
import { getNames } from './getNames';

vi.mock('@/core/network/client');

vi.mock('@/core/utils/getSlicedAddress', () => ({
  getSlicedAddress: vi.fn(),
}));

vi.mock('@/core/network/getChainPublicClient', () => ({
  ...vi.importActual('@/core/network/getChainPublicClient'),
  getChainPublicClient: vi.fn(() => publicClient),
}));

vi.mock('./convertReverseNodeToBytes', () => ({
  convertReverseNodeToBytes: vi.fn((address) => `${address}-bytes`),
}));

vi.mock('./getAddress', () => ({
  getAddress: vi.fn(),
}));

vi.mock('./getAddresses', () => ({
  getAddresses: vi.fn(),
}));

describe('getNames', () => {
  const mockGetEnsName = publicClient.getEnsName as Mock;
  const mockMulticall = publicClient.multicall as Mock;
  const mockGetAddress = getAddress as Mock;
  const mockGetAddresses = getAddresses as Mock;
  const walletAddresses = [
    '0x1234567890123456789012345678901234567890',
    '0x2345678901234567890123456789012345678901',
    '0x3456789012345678901234567890123456789012',
  ] as Address[];

  beforeEach(() => {
    vi.clearAllMocks();

    mockGetAddress.mockImplementation(({ name }) => {
      if (name?.includes('user1')) {
        return Promise.resolve(walletAddresses[0]);
      }
      if (name?.includes('user2')) {
        return Promise.resolve(walletAddresses[1]);
      }
      if (name?.includes('user3')) {
        return Promise.resolve(walletAddresses[2]);
      }
      return Promise.resolve(null);
    });

    mockGetAddresses.mockImplementation(({ names }) => {
      return Promise.resolve(
        names.map((name: string) => {
          if (name?.includes('user1')) {
            return walletAddresses[0];
          }
          if (name?.includes('user2')) {
            return walletAddresses[1];
          }
          if (name?.includes('user3')) {
            return walletAddresses[2];
          }
          return null;
        }),
      );
    });
  });

  it('should return empty array when no addresses are provided', async () => {
    const names = await getNames({ addresses: [] });
    expect(names).toEqual([]);
  });

  it('should fetch ENS names for multiple addresses on mainnet', async () => {
    const expectedEnsNames = ['user1.eth', 'user2.eth', null];
    mockGetEnsName.mockImplementation((params) => {
      const index = walletAddresses.findIndex(
        (addr) => addr === params.address,
      );
      return Promise.resolve(expectedEnsNames[index]);
    });

    const names = await getNames({ addresses: walletAddresses });

    expect(names).toEqual(['user1.eth', 'user2.eth', null]);
    expect(mockGetEnsName).toHaveBeenCalledTimes(3);
    expect(mockGetAddresses).toHaveBeenCalledTimes(1);
    walletAddresses.forEach((address, index) => {
      expect(mockGetEnsName).toHaveBeenNthCalledWith(index + 1, { address });
    });
  });

  it('should fetch Basenames for multiple addresses on Base chain', async () => {
    const expectedBaseNames = ['user1.base', 'user2.base', 'user3.base'];

    mockMulticall.mockResolvedValue(
      expectedBaseNames.map((name) => ({
        status: 'success',
        result: name,
      })),
    );

    const names = await getNames({
      addresses: walletAddresses,
      chain: base,
    });

    expect(names).toEqual(expectedBaseNames);
    expect(mockMulticall).toHaveBeenCalledTimes(1);
    expect(mockGetAddresses).toHaveBeenCalledTimes(1);
    expect(mockMulticall).toHaveBeenCalledWith({
      contracts: walletAddresses.map((address) => ({
        address: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
        abi: L2ResolverAbi,
        functionName: 'name',
        args: [convertReverseNodeToBytes(address, base.id)],
      })),
      allowFailure: true,
    });
  });

  it('should fall back to ENS resolution for unresolved Base names', async () => {
    const baseResults = [
      { status: 'success', result: 'user1.base' },
      { status: 'success', result: 'user2.base' },
      { status: 'failure', result: null },
    ];

    mockMulticall.mockResolvedValue(baseResults);

    mockGetEnsName.mockImplementation((params) => {
      if (params.address === walletAddresses[2]) {
        return Promise.resolve('user3.eth');
      }
      return Promise.resolve(null);
    });

    const names = await getNames({
      addresses: walletAddresses,
      chain: base,
    });

    expect(names).toEqual(['user1.base', 'user2.base', 'user3.eth']);
    expect(mockMulticall).toHaveBeenCalledTimes(1);
    expect(mockGetEnsName).toHaveBeenCalledTimes(1);
    expect(mockGetAddresses).toHaveBeenCalledTimes(2);
    expect(mockGetEnsName).toHaveBeenCalledWith({
      address: walletAddresses[2],
    });
  });

  it('should handle multicall errors gracefully and fall back to ENS', async () => {
    mockMulticall.mockRejectedValue(new Error('Multicall failed'));

    const expectedEnsNames = ['user1.eth', 'user2.eth', 'user3.eth'];
    mockGetEnsName.mockImplementation((params) => {
      const index = walletAddresses.findIndex(
        (addr) => addr === params.address,
      );
      return Promise.resolve(expectedEnsNames[index]);
    });

    const names = await getNames({
      addresses: walletAddresses,
      chain: base,
    });

    expect(names).toEqual(expectedEnsNames);
    expect(mockMulticall).toHaveBeenCalledTimes(1);
    expect(mockGetEnsName).toHaveBeenCalledTimes(3);
    expect(mockGetAddresses).toHaveBeenCalledTimes(1);
  });

  it('should throw an error for unsupported chains', async () => {
    await expect(
      getNames({
        addresses: walletAddresses,
        chain: optimism,
      }),
    ).rejects.toBe(
      'ChainId not supported, name resolution is only supported on Ethereum and Base.',
    );

    expect(mockGetEnsName).not.toHaveBeenCalled();
    expect(mockMulticall).not.toHaveBeenCalled();
    expect(mockGetAddresses).not.toHaveBeenCalled();
  });

  it('should handle ENS resolution errors gracefully', async () => {
    mockGetEnsName.mockRejectedValue(new Error('ENS resolution failed'));

    const names = await getNames({ addresses: walletAddresses });

    expect(names).toEqual([null, null, null]);
    expect(mockGetEnsName).toHaveBeenCalledTimes(3);
    expect(mockGetAddresses).not.toHaveBeenCalled();
  });

  it('should handle partial ENS resolution failures', async () => {
    mockGetEnsName.mockImplementation((params) => {
      if (params.address === walletAddresses[0]) {
        return Promise.resolve('user1.eth');
      }

      if (params.address === walletAddresses[1]) {
        return Promise.reject(new Error('ENS resolution failed'));
      }

      return Promise.resolve('user3.eth');
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const names = await getNames({ addresses: walletAddresses });

    expect(names).toEqual(['user1.eth', null, 'user3.eth']);
    expect(mockGetEnsName).toHaveBeenCalledTimes(3);
    expect(mockGetAddresses).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle errors during batch ENS resolution process', async () => {
    const originalPromiseAll = Promise.all;
    global.Promise.all = vi.fn().mockImplementation(() => {
      throw new Error('Batch ENS resolution failed');
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const names = await getNames({ addresses: walletAddresses });

    expect(names).toEqual([null, null, null]);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error resolving ENS names in batch:',
      expect.any(Error),
    );

    global.Promise.all = originalPromiseAll;
    consoleSpy.mockRestore();
  });

  it('should filter Basenames that fail forward resolution verification', async () => {
    const expectedBaseNames = ['user1.base', 'user2.base', 'user3.base'];

    mockMulticall.mockResolvedValue(
      expectedBaseNames.map((name) => ({
        status: 'success',
        result: name,
      })),
    );

    mockGetAddresses.mockReset();
    mockGetAddresses.mockImplementation(({ names }) => {
      return Promise.resolve(
        names.map((name: string) => {
          if (name === 'user1.base') {
            return walletAddresses[0];
          }
          if (name === 'user2.base') {
            return '0xdifferentaddress';
          }
          if (name === 'user3.base') {
            return walletAddresses[2];
          }
          return null;
        }),
      );
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const names = await getNames({
      addresses: walletAddresses,
      chain: base,
    });

    expect(names).toEqual(['user1.base', null, 'user3.base']);
    expect(mockGetAddresses).toHaveBeenCalledTimes(1);
    expect(mockGetEnsName).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });

  it('should filter ENS names that fail forward resolution verification', async () => {
    const expectedEnsNames = ['user1.eth', 'user2.eth', 'user3.eth'];

    mockGetEnsName.mockImplementation((params) => {
      const index = walletAddresses.findIndex(
        (addr) => addr === params.address,
      );
      return Promise.resolve(expectedEnsNames[index]);
    });

    mockGetAddresses.mockReset();
    mockGetAddresses.mockImplementation(({ names }) => {
      return Promise.resolve(
        names.map((name: string) => {
          if (name === 'user1.eth') {
            return walletAddresses[0];
          }
          if (name === 'user2.eth') {
            return '0xdifferentaddress';
          }
          if (name === 'user3.eth') {
            return walletAddresses[2];
          }
          return null;
        }),
      );
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const names = await getNames({
      addresses: walletAddresses,
      chain: mainnet,
    });

    expect(names).toEqual(['user1.eth', null, 'user3.eth']);
    expect(mockGetAddresses).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });

  it('should handle errors in Basename forward resolution', async () => {
    mockMulticall.mockResolvedValue([
      { status: 'success', result: 'user1.base' },
      { status: 'success', result: 'user2.base' },
      { status: 'success', result: 'user3.base' },
    ]);

    let calledOnce = false;
    mockGetAddresses.mockImplementation(() => {
      if (!calledOnce) {
        calledOnce = true;
        return Promise.reject(new Error('Batch forward resolution failed'));
      }
      return Promise.resolve([null, null, null]);
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const names = await getNames({
      addresses: walletAddresses,
      chain: base,
    });

    expect(names).toEqual([null, null, null]);
    expect(mockGetAddresses).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error during batch basename forward resolution verification:',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it('should handle errors in ENS forward resolution', async () => {
    mockGetEnsName.mockImplementation((params) => {
      const index = walletAddresses.findIndex(
        (addr) => addr === params.address,
      );
      return Promise.resolve(['user1.eth', 'user2.eth', 'user3.eth'][index]);
    });

    mockGetAddresses.mockRejectedValue(
      new Error('Batch forward resolution failed'),
    );

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const names = await getNames({
      addresses: walletAddresses,
      chain: mainnet,
    });

    expect(names).toEqual([null, null, null]);
    expect(mockGetAddresses).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error during batch ENS forward resolution verification:',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it('should handle null addresses from forward resolution', async () => {
    mockGetEnsName.mockImplementation((params) => {
      const index = walletAddresses.findIndex(
        (addr) => addr === params.address,
      );
      return Promise.resolve(['user1.eth', 'user2.eth', 'user3.eth'][index]);
    });

    mockGetAddresses.mockImplementation(({ names }) => {
      return Promise.resolve(
        names.map((name: string) => {
          if (name === 'user1.eth') {
            return walletAddresses[0];
          }
          if (name === 'user2.eth') {
            return null;
          }
          if (name === 'user3.eth') {
            return walletAddresses[2];
          }
          return null;
        }),
      );
    });

    const names = await getNames({
      addresses: walletAddresses,
      chain: mainnet,
    });

    expect(names).toEqual(['user1.eth', null, 'user3.eth']);
    expect(mockGetAddresses).toHaveBeenCalledTimes(1);
  });
});
