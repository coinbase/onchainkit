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

const mockUseQuery = vi.fn();
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type UseQueryType = <TData, _TError = Error>(options: {
    queryKey: unknown[];
    queryFn: () => Promise<TData>;
    [key: string]: unknown;
  }) => unknown;

  return {
    ...actual,
    useQuery: <TData, TError = Error>(options: {
      queryKey: unknown[];
      queryFn: () => Promise<TData>;
      [key: string]: unknown;
    }) => {
      mockUseQuery(options);
      return (actual.useQuery as UseQueryType)<TData, TError>(options);
    },
  };
});

describe('useAvatar', () => {
  const mockGetEnsAvatar = publicClient.getEnsAvatar as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockClear();
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

  it('respects the enabled option in queryOptions', async () => {
    const testEnsName = 'test.ens';
    const testEnsAvatar = 'avatarUrl';

    mockGetEnsAvatar.mockResolvedValue(testEnsAvatar);

    const { result } = renderHook(
      () => useAvatar({ ensName: testEnsName }, { enabled: false }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetched).toBe(false);
    expect(mockGetEnsAvatar).not.toHaveBeenCalled();
  });

  it('uses the default query options when no queryOptions are provided', async () => {
    const testEnsName = 'test.ens';
    const testEnsAvatar = 'avatarUrl';

    mockGetEnsAvatar.mockResolvedValue(testEnsAvatar);

    renderHook(() => useAvatar({ ensName: testEnsName }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => {
      expect(mockGetEnsAvatar).toHaveBeenCalled();
    });
  });

  it('merges custom queryOptions with default options', async () => {
    const testEnsName = 'test.ens';
    const testEnsAvatar = 'avatarUrl';
    const customStaleTime = 60000;

    mockGetEnsAvatar.mockResolvedValue(testEnsAvatar);

    const { result } = renderHook(
      () => useAvatar({ ensName: testEnsName }, { staleTime: customStaleTime }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toBe(testEnsAvatar);
    });

    expect(mockGetEnsAvatar).toHaveBeenCalled();
  });

  it('disables the query when ensName is empty', async () => {
    mockGetEnsAvatar.mockImplementation(() => {
      throw new Error('This should not be called');
    });

    const { result } = renderHook(() => useAvatar({ ensName: '' }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockGetEnsAvatar).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('enables the query when enabled=true is explicitly set and ensName is valid', async () => {
    const testEnsName = 'test.ens';
    const testEnsAvatar = 'avatarUrl';

    mockGetEnsAvatar.mockResolvedValue(testEnsAvatar);

    const { result } = renderHook(
      () => useAvatar({ ensName: testEnsName }, { enabled: true }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toBe(testEnsAvatar);
    });

    expect(mockGetEnsAvatar).toHaveBeenCalled();
  });

  it('correctly maps cacheTime to gcTime for backwards compatibility', async () => {
    const testEnsName = 'test.ens';
    const testEnsAvatar = 'avatarUrl';
    const mockCacheTime = 60000; // 1 minute in milliseconds

    mockGetEnsAvatar.mockResolvedValue(testEnsAvatar);

    // Test with only cacheTime provided
    renderHook(
      () => useAvatar({ ensName: testEnsName }, { cacheTime: mockCacheTime }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    // Verify that cacheTime was mapped to gcTime
    expect(mockUseQuery).toHaveBeenCalled();
    const optionsWithCacheTime = mockUseQuery.mock.calls[0][0];
    expect(optionsWithCacheTime).toHaveProperty('gcTime', mockCacheTime);

    // Test with both cacheTime and gcTime provided
    const mockGcTime = 120000; // 2 minutes in milliseconds

    // Reset the mock to clear previous calls
    mockUseQuery.mockClear();

    renderHook(
      () =>
        useAvatar(
          {
            ensName: testEnsName,
          },
          {
            cacheTime: mockCacheTime,
            gcTime: mockGcTime,
          },
        ),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    // Verify that gcTime takes precedence over cacheTime
    expect(mockUseQuery).toHaveBeenCalled();
    const optionsWithBoth = mockUseQuery.mock.calls[0][0];
    expect(optionsWithBoth).toHaveProperty('gcTime', mockGcTime);
  });
});
