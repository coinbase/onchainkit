import { base, baseSepolia, mainnet, optimism } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { publicClient } from '../../network/client';
import { getChainPublicClient } from '../../network/getChainPublicClient';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { getAvatar } from './getAvatar';

vi.mock('../../network/client');

vi.mock('../../network/getChainPublicClient', () => ({
  ...vi.importActual('../../network/getChainPublicClient'),
  getChainPublicClient: vi.fn(() => publicClient),
}));

describe('getAvatar', () => {
  const mockGetEnsAvatar = publicClient.getEnsAvatar as vi.Mock;
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
  });

  it('should default to mainnet when base mainnet avatar is not available', async () => {
    const ensName = 'shrek.base.eth';
    const expectedAvatarUrl = null;

    mockGetEnsAvatar.mockResolvedValue(expectedAvatarUrl);
    const avatarUrl = await getAvatar({ ensName, chain: base });

    expect(avatarUrl).toBe(null);
    expect(mockGetEnsAvatar).toHaveBeenCalledWith({
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });

    expect(getChainPublicClient).toHaveBeenCalledWith(base);

    // getAvatar defaulted to mainnet
    expect(getChainPublicClient).toHaveBeenCalledWith(mainnet);
  });

  it('should default to mainnet when base sepolia avatar is not available', async () => {
    const ensName = 'shrek.basetest.eth';
    const expectedAvatarUrl = null;

    mockGetEnsAvatar.mockResolvedValue(expectedAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: baseSepolia });

    expect(avatarUrl).toBe(expectedAvatarUrl);
    expect(mockGetEnsAvatar).toHaveBeenCalledWith({
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[baseSepolia.id],
    });
    expect(getChainPublicClient).toHaveBeenCalledWith(baseSepolia);

    // getAvatar defaulted to mainnet
    expect(getChainPublicClient).toHaveBeenCalledWith(mainnet);
  });

  it('should throw an error on unsupported chain', async () => {
    const ensName = 'shrek.basetest.eth';
    await expect(getAvatar({ ensName, chain: optimism })).rejects.toBe(
      'ChainId not supported, avatar resolution is only supported on Ethereum and Base.',
    );
  });
});
