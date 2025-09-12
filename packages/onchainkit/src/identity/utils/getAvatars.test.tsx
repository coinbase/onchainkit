import { base, baseSepolia, mainnet, optimism } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getChainPublicClient } from '../../core/network/getChainPublicClient';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { getAvatars } from './getAvatars';
import { getBaseDefaultProfilePicture } from './getBaseDefaultProfilePicture';

vi.mock('@/core/network/getChainPublicClient');

vi.mock('./getBaseDefaultProfilePicture', () => ({
  getBaseDefaultProfilePicture: vi.fn(() => 'default-base-avatar'),
}));

describe('getAvatars', () => {
  const mockClient = {
    getEnsAvatar: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(getChainPublicClient).mockReturnValue(mockClient as any);
  });

  it('should return empty array when ensNames is empty', async () => {
    const result = await getAvatars({ ensNames: [] });
    expect(result).toEqual([]);
    expect(mockClient.getEnsAvatar).not.toHaveBeenCalled();
  });

  it('should return correct avatar URLs from client getEnsAvatar', async () => {
    const ensNames = ['test1.ens', 'test2.ens'];
    const expectedAvatarUrls = ['avatarUrl1', 'avatarUrl2'];

    mockClient.getEnsAvatar
      .mockResolvedValueOnce(expectedAvatarUrls[0])
      .mockResolvedValueOnce(expectedAvatarUrls[1]);

    const avatarUrls = await getAvatars({ ensNames });

    expect(avatarUrls).toEqual(expectedAvatarUrls);
    expect(mockClient.getEnsAvatar).toHaveBeenCalledTimes(2);
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensNames[0],
    });
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensNames[1],
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenCalledWith(mainnet);
  });

  it('should handle null avatars correctly', async () => {
    const ensNames = ['test1.ens', 'test2.ens'];

    mockClient.getEnsAvatar
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    const avatarUrls = await getAvatars({ ensNames });

    expect(avatarUrls).toEqual([null, null]);
    expect(mockClient.getEnsAvatar).toHaveBeenCalledTimes(2);
  });

  it('should resolve base mainnet avatars', async () => {
    const ensNames = ['shrek.base.eth', 'donkey.base.eth'];
    const expectedAvatarUrls = ['shrekface', 'donkeyface'];

    mockClient.getEnsAvatar
      .mockResolvedValueOnce(expectedAvatarUrls[0])
      .mockResolvedValueOnce(expectedAvatarUrls[1]);

    const avatarUrls = await getAvatars({
      ensNames,
      chain: base as unknown as typeof mainnet,
    });

    expect(avatarUrls).toEqual(expectedAvatarUrls);
    expect(mockClient.getEnsAvatar).toHaveBeenCalledTimes(2);
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensNames[0],
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensNames[1],
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenCalledWith(base);
  });

  it('should resolve base sepolia avatars', async () => {
    const ensNames = ['shrek.basetest.eth', 'donkey.basetest.eth'];
    const expectedAvatarUrls = ['shrektestface', 'donkeytestface'];

    mockClient.getEnsAvatar
      .mockResolvedValueOnce(expectedAvatarUrls[0])
      .mockResolvedValueOnce(expectedAvatarUrls[1]);

    const avatarUrls = await getAvatars({
      ensNames,
      chain: baseSepolia as unknown as typeof mainnet,
    });

    expect(avatarUrls).toEqual(expectedAvatarUrls);
    expect(mockClient.getEnsAvatar).toHaveBeenCalledTimes(2);
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensNames[0],
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[baseSepolia.id],
    });
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensNames[1],
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[baseSepolia.id],
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenCalledWith(baseSepolia);
  });

  it('should default to mainnet when base mainnet avatars are not available', async () => {
    const ensNames = ['shrek.base.eth', 'donkey.base.eth'];
    const expectedMainnetAvatarUrls = ['mainnetshrek.eth', 'mainnetdonkey.eth'];

    mockClient.getEnsAvatar
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)

      .mockResolvedValueOnce(expectedMainnetAvatarUrls[0])
      .mockResolvedValueOnce(expectedMainnetAvatarUrls[1]);

    const avatarUrls = await getAvatars({
      ensNames,
      chain: base as unknown as typeof mainnet,
    });

    expect(avatarUrls).toEqual(expectedMainnetAvatarUrls);

    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensNames[0],
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensNames[1],
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });

    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(3, {
      name: ensNames[0],
    });
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(4, {
      name: ensNames[1],
    });

    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(1, base);
    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(2, mainnet);
  });

  it('should use default base avatar when both mainnet and base avatars are not available', async () => {
    const ensNames = ['shrek.base.eth', 'regular.eth'];

    mockClient.getEnsAvatar.mockResolvedValue(null);

    const avatarUrls = await getAvatars({
      ensNames,
      chain: base as unknown as typeof mainnet,
    });

    expect(avatarUrls).toEqual(['default-base-avatar', null]);

    expect(getBaseDefaultProfilePicture).toHaveBeenCalledWith(ensNames[0]);
    expect(getBaseDefaultProfilePicture).not.toHaveBeenCalledWith(ensNames[1]);
  });

  it('should throw an error on unsupported chain', async () => {
    const ensNames = ['shrek.base.eth', 'donkey.base.eth'];

    await expect(
      getAvatars({
        ensNames,
        chain: optimism as unknown as typeof mainnet,
      }),
    ).rejects.toBe(
      'ChainId not supported, avatar resolution is only supported on Ethereum and Base.',
    );

    expect(vi.mocked(getChainPublicClient)).not.toHaveBeenCalled();
  });

  it('should handle errors when resolving base avatars and continue with mainnet', async () => {
    const ensNames = ['shrek.base.eth', 'donkey.base.eth'];
    const expectedMainnetAvatarUrls = ['mainnetshrek.eth', 'mainnetdonkey.eth'];

    mockClient.getEnsAvatar
      .mockImplementationOnce(() => {
        throw new Error('Base resolution error');
      })

      .mockResolvedValueOnce(expectedMainnetAvatarUrls[0])
      .mockResolvedValueOnce(expectedMainnetAvatarUrls[1]);

    const avatarUrls = await getAvatars({
      ensNames,
      chain: base as unknown as typeof mainnet,
    });

    expect(avatarUrls).toEqual(expectedMainnetAvatarUrls);

    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensNames[0],
    });
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(3, {
      name: ensNames[1],
    });
  });

  it('should handle mixed basename and regular ENS names correctly', async () => {
    const ensNames = ['shrek.base.eth', 'regular.eth'];
    const baseAvatarUrl = 'baseavatar';

    mockClient.getEnsAvatar.mockReset();

    mockClient.getEnsAvatar
      .mockResolvedValueOnce(baseAvatarUrl)
      .mockResolvedValueOnce(null);

    const avatarUrls = await getAvatars({
      ensNames,
      chain: base as unknown as typeof mainnet,
    });

    expect(avatarUrls).toEqual([baseAvatarUrl, null]);

    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensNames[0],
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });

    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensNames[1],
    });
  });

  it('should handle errors when resolving mainnet avatars', async () => {
    const ensNames = ['test1.ens', 'test2.ens'];

    mockClient.getEnsAvatar.mockReset();

    mockClient.getEnsAvatar.mockImplementationOnce(() => {
      throw new Error('Mainnet resolution error');
    });

    const avatarUrls = await getAvatars({ ensNames });

    expect(avatarUrls).toEqual([null, null]);

    expect(mockClient.getEnsAvatar).toHaveBeenCalledWith({
      name: ensNames[0],
    });
  });

  it('should handle partial failures in batch avatar resolution', async () => {
    const ensNames = ['success1.eth', 'fail.eth', 'success2.eth'];
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockClient.getEnsAvatar.mockReset();
    mockClient.getEnsAvatar.mockImplementation((params) => {
      if (params.name === 'fail.eth') {
        return Promise.reject(
          new Error('Avatar resolution failed for this name'),
        );
      }

      if (params.name === 'success1.eth') {
        return Promise.resolve('avatar1-url');
      }

      if (params.name === 'success2.eth') {
        return Promise.resolve('avatar2-url');
      }

      return Promise.resolve(null);
    });

    const avatarUrls = await getAvatars({ ensNames });

    expect(avatarUrls).toEqual(['avatar1-url', null, 'avatar2-url']);
    expect(mockClient.getEnsAvatar).toHaveBeenCalledTimes(3);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error resolving ENS avatar for fail.eth:',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it('should handle partial failures in batch Base avatar resolution', async () => {
    const ensNames = [
      'success1.base.eth',
      'fail.base.eth',
      'success2.base.eth',
    ];
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockClient.getEnsAvatar.mockReset();
    mockClient.getEnsAvatar.mockImplementation((params) => {
      if (params.name === 'fail.base.eth') {
        return Promise.reject(new Error('Base avatar resolution failed'));
      }

      if (params.name === 'success1.base.eth') {
        return Promise.resolve('base-avatar1-url');
      }

      if (params.name === 'success2.base.eth') {
        return Promise.resolve('base-avatar2-url');
      }

      return Promise.resolve(null);
    });

    const avatarUrls = await getAvatars({
      ensNames,
      chain: base as unknown as typeof mainnet,
    });

    expect(avatarUrls).toEqual([
      'base-avatar1-url',
      'default-base-avatar',
      'base-avatar2-url',
    ]);

    expect(mockClient.getEnsAvatar).toHaveBeenCalledWith({
      name: 'success1.base.eth',
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });
    expect(mockClient.getEnsAvatar).toHaveBeenCalledWith({
      name: 'fail.base.eth',
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });
    expect(mockClient.getEnsAvatar).toHaveBeenCalledWith({
      name: 'success2.base.eth',
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error resolving Base avatar for fail.base.eth:',
      expect.any(Error),
    );

    expect(getBaseDefaultProfilePicture).toHaveBeenCalledWith('fail.base.eth');

    consoleSpy.mockRestore();
  });
});
