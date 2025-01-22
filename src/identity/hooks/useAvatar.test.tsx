import { publicClient } from '@/core/network/client';
import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import { renderHook, waitFor } from '@testing-library/react';
import { base, baseSepolia, mainnet, optimism } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getNewReactQueryTestProvider } from './getNewReactQueryTestProvider';
import { useAvatar } from './useAvatar';

vi.mock('@/core/network/client');

vi.mock('@/core/network/getChainPublicClient', () => ({
  ...vi.importActual('@/core/network/getChainPublicClient'),
  getChainPublicClient: vi.fn(() => publicClient),
}));

describe('useAvatar', () => {
  const mockGetEnsAvatar = publicClient.getEnsAvatar as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the correct ENS avatar and loading state', async () => {
    const testEnsName = 'test.ens';
    const testEnsAvatar = 'avatarUrl';

    // Mock the getEnsAvatar method of the publicClient
    mockGetEnsAvatar.mockResolvedValue(testEnsAvatar);

    // Use the renderHook function to create a test harness for the useAvatar hook
    const { result } = renderHook(() => useAvatar({ ensName: testEnsName }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    // Wait for the hook to finish fetching the ENS avatar
    await waitFor(() => {
      // Check that the ENS avatar and loading state are correct
      expect(result.current.data).toBe(testEnsAvatar);
      expect(result.current.isLoading).toBe(false);
    });

    expect(getChainPublicClient).toHaveBeenCalledWith(mainnet);
  });

  it('returns the loading state true while still fetching ENS avatar', async () => {
    const testEnsName = 'test.ens';

    // Use the renderHook function to create a test harness for the useAvatar hook
    const { result } = renderHook(() => useAvatar({ ensName: testEnsName }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    // Wait for the hook to finish fetching the ENS avatar
    await waitFor(() => {
      // Check that the loading state is correct
      expect(result.current.data).toBe(undefined);
      expect(result.current.isLoading).toBe(true);
    });
  });

  it('return correct base mainnet avatar', async () => {
    const testEnsName = 'shrek.base.eth';
    const testEnsAvatar = 'shrekface';

    // Mock the getEnsAvatar method of the publicClient
    mockGetEnsAvatar.mockResolvedValue(testEnsAvatar);

    // Use the renderHook function to create a test harness for the useAvatar hook
    const { result } = renderHook(
      () => useAvatar({ ensName: testEnsName, chain: base }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    // Wait for the hook to finish fetching the ENS avatar
    await waitFor(() => {
      // Check that the ENS avatar and loading state are correct
      expect(result.current.data).toBe(testEnsAvatar);
      expect(result.current.isLoading).toBe(false);
    });

    expect(getChainPublicClient).toHaveBeenCalledWith(base);
  });

  it('return correct base sepolia avatar', async () => {
    const testEnsName = 'shrek.basetest.eth';
    const testEnsAvatar = 'shrektestface';

    // Mock the getEnsAvatar method of the publicClient
    mockGetEnsAvatar.mockResolvedValue(testEnsAvatar);

    // Use the renderHook function to create a test harness for the useAvatar hook
    const { result } = renderHook(
      () => useAvatar({ ensName: testEnsName, chain: baseSepolia }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    // Wait for the hook to finish fetching the ENS avatar
    await waitFor(() => {
      // Check that the ENS avatar and loading state are correct
      expect(result.current.data).toBe(testEnsAvatar);
      expect(result.current.isLoading).toBe(false);
    });

    expect(getChainPublicClient).toHaveBeenCalledWith(baseSepolia);
  });

  it('returns error for unsupported chain ', async () => {
    const testEnsName = 'shrek.basetest.eth';
    const testEnsAvatar = 'shrektestface';

    // Mock the getEnsAvatar method of the publicClient
    mockGetEnsAvatar.mockResolvedValue(testEnsAvatar);

    // Use the renderHook function to create a test harness for the useAvatar hook
    const { result } = renderHook(
      () => useAvatar({ ensName: testEnsName, chain: optimism }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    // Wait for the hook to finish fetching the ENS name
    await waitFor(() => {
      // Check that the ENS name and loading state are correct
      expect(result.current.data).toBe(undefined);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(
        'ChainId not supported, avatar resolution is only supported on Ethereum and Base.',
      );
    });
  });
});
