import { base, baseSepolia, mainnet, optimism } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { publicClient } from '../../core/network/client';
import { getChainPublicClient } from '../../core/network/getChainPublicClient';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { getAvatar } from './getAvatar';

vi.mock('@/core/network/client');

vi.mock('@/core/network/getChainPublicClient', () => ({
  ...vi.importActual('@/core/network/getChainPublicClient'),
  getChainPublicClient: vi.fn(() => publicClient),
}));

describe('getAvatar', () => {
  const mockGetEnsAvatar = publicClient.getEnsAvatar as Mock;
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return correct avatar URL from client getAvatar', async () => {
    const ensName = 'test.ens';
    const expectedAvatarUrl = 'avatarUrl';

    mockGetEnsAvatar.mockResolvedValue(expectedAvatarUrl);

    const avatarUrl = await getAvatar({ ensName });

    expect(avatarUrl).toBe(expectedAvatarUrl);
    expect(mockGetEnsAvatar).toHaveBeenCalledWith({ name: ensName });
    expect(getChainPublicClient).toHaveBeenCalledWith(mainnet);
  });

  it('should return null when client getAvatar throws an error', async () => {
    const ensName = 'test.ens';

    mockGetEnsAvatar.mockRejectedValue(new Error('This is an error'));

    await expect(getAvatar({ ensName })).rejects.toThrow('This is an error');
  });

  it('should resolve to base mainnet avatar', async () => {
    const ensName = 'shrek.base.eth';
    const expectedAvatarUrl = 'shrekface';

    mockGetEnsAvatar.mockResolvedValue(expectedAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: base });

    expect(avatarUrl).toBe(expectedAvatarUrl);
    expect(mockGetEnsAvatar).toHaveBeenCalledWith({
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });
    expect(getChainPublicClient).toHaveBeenCalledWith(base);
    expect(getChainPublicClient).not.toHaveBeenCalledWith(mainnet);
  });

  it('should resolve to base sepolia avatar', async () => {
    const ensName = 'shrek.basetest.eth';
    const expectedAvatarUrl = 'shrekfacetest';

    mockGetEnsAvatar.mockResolvedValue(expectedAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: baseSepolia });

    expect(avatarUrl).toBe(expectedAvatarUrl);
    expect(mockGetEnsAvatar).toHaveBeenCalledWith({
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[baseSepolia.id],
    });
    expect(getChainPublicClient).toHaveBeenCalledWith(baseSepolia);
    expect(getChainPublicClient).not.toHaveBeenCalledWith(mainnet);
  });

  it('should default to mainnet when base mainnet avatar is not available', async () => {
    const ensName = 'shrek.base.eth';
    const expectedBaseAvatarUrl = null;
    const expectedMainnetAvatarUrl = 'mainnetname.eth';

    mockGetEnsAvatar
      .mockResolvedValueOnce(expectedBaseAvatarUrl)
      .mockResolvedValueOnce(expectedMainnetAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: base });

    expect(avatarUrl).toBe(expectedMainnetAvatarUrl);
    expect(mockGetEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });
    expect(getChainPublicClient).toHaveBeenNthCalledWith(1, base);

    // getAvatar defaulted to mainnet
    expect(mockGetEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensName,
      universalResolverAddress: undefined,
    });
    expect(getChainPublicClient).toHaveBeenNthCalledWith(2, mainnet);
  });

  it('should default to mainnet when base sepolia avatar is not available', async () => {
    const ensName = 'shrek.basetest.eth';
    const expectedBaseAvatarUrl = null;
    const expectedMainnetAvatarUrl = 'mainnetname.eth';

    mockGetEnsAvatar
      .mockResolvedValueOnce(expectedBaseAvatarUrl)
      .mockResolvedValueOnce(expectedMainnetAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: baseSepolia });

    expect(avatarUrl).toBe(expectedMainnetAvatarUrl);
    expect(mockGetEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[baseSepolia.id],
    });
    expect(getChainPublicClient).toHaveBeenNthCalledWith(1, baseSepolia);

    // getAvatar defaulted to mainnet
    expect(mockGetEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensName,
      universalResolverAddress: undefined,
    });
    expect(getChainPublicClient).toHaveBeenNthCalledWith(2, mainnet);
  });

  it('should use default base avatar when both mainnet and base mainnet avatar are not available', async () => {
    const ensName = 'shrek.base.eth';
    const expectedBaseAvatarUrl = null;
    const expectedMainnetAvatarUrl = null;

    mockGetEnsAvatar
      .mockResolvedValueOnce(expectedBaseAvatarUrl)
      .mockResolvedValueOnce(expectedMainnetAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: base });

    const avatarUrlIsUriData = avatarUrl?.startsWith(
      'data:image/svg+xml;base64',
    );
    expect(avatarUrlIsUriData).toBe(true);
    expect(mockGetEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });
    expect(getChainPublicClient).toHaveBeenNthCalledWith(1, base);

    // getAvatar defaulted to mainnet
    expect(mockGetEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensName,
      universalResolverAddress: undefined,
    });
    expect(getChainPublicClient).toHaveBeenNthCalledWith(2, mainnet);
  });

  it('should use default base avatar when both mainnet and base sepolia avatar are not available', async () => {
    const ensName = 'shrek.basetest.eth';
    const expectedBaseAvatarUrl = null;
    const expectedMainnetAvatarUrl = null;

    mockGetEnsAvatar
      .mockResolvedValueOnce(expectedBaseAvatarUrl)
      .mockResolvedValueOnce(expectedMainnetAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: baseSepolia });

    const avatarUrlIsUriData = avatarUrl?.startsWith(
      'data:image/svg+xml;base64',
    );
    expect(avatarUrlIsUriData).toBe(true);
    expect(mockGetEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[baseSepolia.id],
    });
    expect(getChainPublicClient).toHaveBeenNthCalledWith(1, baseSepolia);

    // getAvatar defaulted to mainnet
    expect(mockGetEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensName,
      universalResolverAddress: undefined,
    });
    expect(getChainPublicClient).toHaveBeenNthCalledWith(2, mainnet);
  });

  it('should never default base avatar for non-basename', async () => {
    const ensName = 'ethereummainnetname.eth';
    const expectedBaseAvatarUrl = null;
    const expectedMainnetAvatarUrl = null;

    mockGetEnsAvatar
      .mockResolvedValueOnce(expectedBaseAvatarUrl)
      .mockResolvedValueOnce(expectedMainnetAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: base });

    expect(avatarUrl).toBe(null);
    expect(mockGetEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });
    expect(getChainPublicClient).toHaveBeenNthCalledWith(1, base);

    // getAvatar defaulted to mainnet
    expect(mockGetEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensName,
      universalResolverAddress: undefined,
    });
    expect(getChainPublicClient).toHaveBeenNthCalledWith(2, mainnet);
  });

  it('should never default base avatar for non-basename', async () => {
    const ensName = 'ethereummainnetname.eth';
    const expectedBaseAvatarUrl = null;
    const expectedMainnetAvatarUrl = null;

    mockGetEnsAvatar
      .mockResolvedValueOnce(expectedBaseAvatarUrl)
      .mockResolvedValueOnce(expectedMainnetAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: baseSepolia });

    expect(avatarUrl).toBe(null);
    expect(mockGetEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[baseSepolia.id],
    });
    expect(getChainPublicClient).toHaveBeenNthCalledWith(1, baseSepolia);

    // getAvatar defaulted to mainnet
    expect(mockGetEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensName,
      universalResolverAddress: undefined,
    });
    expect(getChainPublicClient).toHaveBeenNthCalledWith(2, mainnet);
  });

  it('should throw an error on unsupported chain', async () => {
    const ensName = 'shrek.basetest.eth';
    await expect(getAvatar({ ensName, chain: optimism })).rejects.toBe(
      'ChainId not supported, avatar resolution is only supported on Ethereum and Base.',
    );
    expect(getChainPublicClient).not.toHaveBeenCalled();
  });

  it('should ignore base call error and default to mainnet', async () => {
    const ensName = 'shrek.base.eth';
    const expectedMainnetAvatarUrl = 'mainnetname.eth';

    mockGetEnsAvatar
      .mockImplementationOnce(() => {
        throw new Error('thrown error');
      })
      .mockResolvedValueOnce(expectedMainnetAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: base });

    expect(avatarUrl).toBe(expectedMainnetAvatarUrl);
    expect(mockGetEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });
    expect(getChainPublicClient).toHaveBeenNthCalledWith(1, base);

    // getAvatar defaulted to mainnet
    expect(mockGetEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensName,
      universalResolverAddress: undefined,
    });
    expect(getChainPublicClient).toHaveBeenNthCalledWith(2, mainnet);
  });
});
