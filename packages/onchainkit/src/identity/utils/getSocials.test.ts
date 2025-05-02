import { isBase } from '@/core/utils/isBase';
import { isEthereum } from '@/core/utils/isEthereum';
import { http } from 'viem';
import { createPublicClient } from 'viem';
import { base, mainnet } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getChainPublicClient } from '../../core/network/getChainPublicClient';
import { getSocials } from './getSocials';

vi.mock('@/core/utils/isBase');
vi.mock('@/core/utils/isEthereum');
vi.mock('@/core/network/getChainPublicClient');

describe('getSocials', () => {
  const actualClient = createPublicClient({
    chain: mainnet,
    transport: http(),
  });
  const mockClient = {
    ...actualClient,
    getEnsText: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getChainPublicClient).mockReturnValue(mockClient);
  });

  it('should fetch social records for a valid ENS name on Ethereum mainnet', async () => {
    const ensName = 'vitalik.eth';
    vi.mocked(isEthereum).mockReturnValue(true);
    vi.mocked(isBase).mockReturnValue(false);

    mockClient.getEnsText.mockImplementation(({ key }) => {
      switch (key) {
        case 'com.twitter':
          return Promise.resolve('vitalik');
        case 'com.github':
          return Promise.resolve('vitalikbuterin');
        case 'xyz.farcaster':
          return Promise.resolve('vitalikbuterin');
        case 'url':
          return Promise.resolve('https://vitalik.ca');
      }
    });

    const result = await getSocials({ ensName, chain: mainnet });

    expect(result).toEqual({
      twitter: 'vitalik',
      github: 'vitalikbuterin',
      farcaster: 'vitalikbuterin',
      website: 'https://vitalik.ca',
    });

    expect(mockClient.getEnsText).toHaveBeenCalledTimes(4);
  });

  it('should fetch social records for a valid ENS name on Base', async () => {
    const ensName = 'example.eth';
    vi.mocked(isBase).mockReturnValue(true);
    vi.mocked(isEthereum).mockReturnValue(false);

    mockClient.getEnsText.mockImplementation(({ key }) => {
      switch (key) {
        case 'com.twitter':
          return Promise.resolve('exampletwitter');
        case 'com.github':
          return Promise.resolve('examplegithub');
        case 'xyz.farcaster':
          return Promise.resolve(null);
        case 'url':
          return Promise.resolve('https://example.com');
      }
    });

    const result = await getSocials({ ensName, chain: base });

    expect(result).toEqual({
      twitter: 'exampletwitter',
      github: 'examplegithub',
      farcaster: null,
      website: 'https://example.com',
    });

    expect(mockClient.getEnsText).toHaveBeenCalledTimes(4);
  });

  it('should normalize the ENS name', async () => {
    const ensName = 'Test.eth';
    vi.mocked(isEthereum).mockReturnValue(true);
    vi.mocked(isBase).mockReturnValue(false);

    mockClient.getEnsText.mockResolvedValue(null);

    await getSocials({ ensName, chain: mainnet });

    expect(mockClient.getEnsText).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'test.eth',
      }),
    );
  });

  it('should handle all social fields being null', async () => {
    const ensName = 'empty.eth';
    vi.mocked(isEthereum).mockReturnValue(true);
    vi.mocked(isBase).mockReturnValue(false);

    mockClient.getEnsText.mockResolvedValue(null);

    const result = await getSocials({ ensName, chain: mainnet });

    expect(result).toEqual({
      twitter: null,
      github: null,
      farcaster: null,
      website: null,
    });

    expect(mockClient.getEnsText).toHaveBeenCalledTimes(4);
  });

  it('should return null for empty ENS name instead of throwing an error', async () => {
    const ensName = '';
    vi.mocked(isEthereum).mockReturnValue(true);

    const result = await getSocials({ ensName, chain: mainnet });

    expect(result).toEqual({
      twitter: null,
      github: null,
      farcaster: null,
      website: null,
    });
  });

  it('should handle unexpected data types from fetchTextRecord', async () => {
    const ensName = 'unexpected.eth';
    vi.mocked(isEthereum).mockReturnValue(true);
    mockClient.getEnsText.mockResolvedValue(123);

    const result = await getSocials({ ensName, chain: mainnet });

    expect(result).toEqual({
      twitter: 123,
      github: 123,
      farcaster: 123,
      website: 123,
    });
  });

  it('should throw an error if getChainPublicClient throws', async () => {
    vi.mocked(isEthereum).mockReturnValue(true);
    vi.mocked(isBase).mockReturnValue(false);

    vi.mocked(getChainPublicClient).mockImplementation(() => {
      throw new Error('Client Error');
    });

    await expect(getSocials({ ensName: 'error.eth' })).rejects.toThrow(
      'Client Error',
    );
  });

  it('should handle errors in fetchTextRecord gracefully', async () => {
    const ensName = 'error.eth';
    vi.mocked(isEthereum).mockReturnValue(true);
    vi.mocked(isBase).mockReturnValue(false);

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mockClient.getEnsText.mockImplementation(({ key }) => {
      if (key === 'com.twitter') {
        throw new Error('Failed to fetch');
      }
      return Promise.resolve('somevalue');
    });

    const result = await getSocials({ ensName, chain: mainnet });

    expect(result).toEqual({
      twitter: null,
      github: 'somevalue',
      farcaster: 'somevalue',
      website: 'somevalue',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch ENS text record for com.twitter:',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
