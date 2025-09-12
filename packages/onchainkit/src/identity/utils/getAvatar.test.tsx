import { base, baseSepolia, mainnet, optimism } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getChainPublicClient } from '../../core/network/getChainPublicClient';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { getAvatar } from './getAvatar';

vi.mock('@/core/network/getChainPublicClient');

describe('getAvatar', () => {
  const mockClient = {
    getEnsAvatar: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(getChainPublicClient).mockReturnValue(mockClient as any);
  });

  it('should return correct avatar URL from client getAvatar', async () => {
    const ensName = 'test.ens';
    const expectedAvatarUrl = 'avatarUrl';

    mockClient.getEnsAvatar.mockResolvedValue(expectedAvatarUrl);

    const avatarUrl = await getAvatar({ ensName });

    expect(avatarUrl).toBe(expectedAvatarUrl);
    expect(mockClient.getEnsAvatar).toHaveBeenCalledWith({ name: ensName });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenCalledWith(mainnet);
  });

  it('should return null when client getAvatar throws an error', async () => {
    const ensName = 'test.ens';

    mockClient.getEnsAvatar.mockRejectedValue(new Error('This is an error'));

    await expect(getAvatar({ ensName })).rejects.toThrow('This is an error');
  });

  it('should resolve to base mainnet avatar', async () => {
    const ensName = 'shrek.base.eth';
    const expectedAvatarUrl = 'shrekface';

    mockClient.getEnsAvatar.mockResolvedValue(expectedAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: base });

    expect(avatarUrl).toBe(expectedAvatarUrl);
    expect(mockClient.getEnsAvatar).toHaveBeenCalledWith({
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenCalledWith(base);
    expect(vi.mocked(getChainPublicClient)).not.toHaveBeenCalledWith(mainnet);
  });

  it('should resolve to base sepolia avatar', async () => {
    const ensName = 'shrek.basetest.eth';
    const expectedAvatarUrl = 'shrekfacetest';

    mockClient.getEnsAvatar.mockResolvedValue(expectedAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: baseSepolia });

    expect(avatarUrl).toBe(expectedAvatarUrl);
    expect(mockClient.getEnsAvatar).toHaveBeenCalledWith({
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[baseSepolia.id],
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenCalledWith(baseSepolia);
    expect(vi.mocked(getChainPublicClient)).not.toHaveBeenCalledWith(mainnet);
  });

  it('should default to mainnet when base mainnet avatar is not available', async () => {
    const ensName = 'shrek.base.eth';
    const expectedBaseAvatarUrl = null;
    const expectedMainnetAvatarUrl = 'mainnetname.eth';

    mockClient.getEnsAvatar
      .mockResolvedValueOnce(expectedBaseAvatarUrl)
      .mockResolvedValueOnce(expectedMainnetAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: base });

    expect(avatarUrl).toBe(expectedMainnetAvatarUrl);
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(1, base);

    // getAvatar defaulted to mainnet
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensName,
      universalResolverAddress: undefined,
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(2, mainnet);
  });

  it('should default to mainnet when base sepolia avatar is not available', async () => {
    const ensName = 'shrek.basetest.eth';
    const expectedBaseAvatarUrl = null;
    const expectedMainnetAvatarUrl = 'mainnetname.eth';

    mockClient.getEnsAvatar
      .mockResolvedValueOnce(expectedBaseAvatarUrl)
      .mockResolvedValueOnce(expectedMainnetAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: baseSepolia });

    expect(avatarUrl).toBe(expectedMainnetAvatarUrl);
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[baseSepolia.id],
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(
      1,
      baseSepolia,
    );

    // getAvatar defaulted to mainnet
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensName,
      universalResolverAddress: undefined,
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(2, mainnet);
  });

  it('should use default base avatar when both mainnet and base mainnet avatar are not available', async () => {
    const ensName = 'shrek.base.eth';
    const expectedBaseAvatarUrl = null;
    const expectedMainnetAvatarUrl = null;

    mockClient.getEnsAvatar
      .mockResolvedValueOnce(expectedBaseAvatarUrl)
      .mockResolvedValueOnce(expectedMainnetAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: base });

    const avatarUrlIsUriData = avatarUrl?.startsWith(
      'data:image/svg+xml;base64',
    );
    expect(avatarUrlIsUriData).toBe(true);
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(1, base);

    // getAvatar defaulted to mainnet
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensName,
      universalResolverAddress: undefined,
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(2, mainnet);
  });

  it('should use default base avatar when both mainnet and base sepolia avatar are not available', async () => {
    const ensName = 'shrek.basetest.eth';
    const expectedBaseAvatarUrl = null;
    const expectedMainnetAvatarUrl = null;

    mockClient.getEnsAvatar
      .mockResolvedValueOnce(expectedBaseAvatarUrl)
      .mockResolvedValueOnce(expectedMainnetAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: baseSepolia });

    const avatarUrlIsUriData = avatarUrl?.startsWith(
      'data:image/svg+xml;base64',
    );
    expect(avatarUrlIsUriData).toBe(true);
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[baseSepolia.id],
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(
      1,
      baseSepolia,
    );

    // getAvatar defaulted to mainnet
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensName,
      universalResolverAddress: undefined,
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(2, mainnet);
  });

  it('should never default base avatar for non-basename', async () => {
    const ensName = 'ethereummainnetname.eth';
    const expectedBaseAvatarUrl = null;
    const expectedMainnetAvatarUrl = null;

    mockClient.getEnsAvatar
      .mockResolvedValueOnce(expectedBaseAvatarUrl)
      .mockResolvedValueOnce(expectedMainnetAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: base });

    expect(avatarUrl).toBe(null);
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(1, base);

    // getAvatar defaulted to mainnet
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensName,
      universalResolverAddress: undefined,
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(2, mainnet);
  });

  it('should never default base avatar for non-basename', async () => {
    const ensName = 'ethereummainnetname.eth';
    const expectedBaseAvatarUrl = null;
    const expectedMainnetAvatarUrl = null;

    mockClient.getEnsAvatar
      .mockResolvedValueOnce(expectedBaseAvatarUrl)
      .mockResolvedValueOnce(expectedMainnetAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: baseSepolia });

    expect(avatarUrl).toBe(null);
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[baseSepolia.id],
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(
      1,
      baseSepolia,
    );

    // getAvatar defaulted to mainnet
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensName,
      universalResolverAddress: undefined,
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(2, mainnet);
  });

  it('should throw an error on unsupported chain', async () => {
    const ensName = 'shrek.basetest.eth';
    await expect(getAvatar({ ensName, chain: optimism })).rejects.toBe(
      'ChainId not supported, avatar resolution is only supported on Ethereum and Base.',
    );
    expect(vi.mocked(getChainPublicClient)).not.toHaveBeenCalled();
  });

  it('should ignore base call error and default to mainnet', async () => {
    const ensName = 'shrek.base.eth';
    const expectedMainnetAvatarUrl = 'mainnetname.eth';

    mockClient.getEnsAvatar
      .mockImplementationOnce(() => {
        throw new Error('thrown error');
      })
      .mockResolvedValueOnce(expectedMainnetAvatarUrl);

    const avatarUrl = await getAvatar({ ensName, chain: base });

    expect(avatarUrl).toBe(expectedMainnetAvatarUrl);
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(1, {
      name: ensName,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[base.id],
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(1, base);

    // getAvatar defaulted to mainnet
    expect(mockClient.getEnsAvatar).toHaveBeenNthCalledWith(2, {
      name: ensName,
      universalResolverAddress: undefined,
    });
    expect(vi.mocked(getChainPublicClient)).toHaveBeenNthCalledWith(2, mainnet);
  });
});
