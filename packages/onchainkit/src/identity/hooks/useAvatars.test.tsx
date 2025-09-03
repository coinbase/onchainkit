import { renderHook, waitFor } from '@testing-library/react';
import { base, baseSepolia, mainnet, optimism } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getNewReactQueryTestProvider } from './getNewReactQueryTestProvider';
import { useAvatars } from './useAvatars';

const mockGetAvatars = vi.fn();
vi.mock('@/identity/utils/getAvatars', () => ({
  getAvatars: mockGetAvatars,
}));

// Mock for testing cacheTime to gcTime mapping
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

describe('useAvatars', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockClear();
    mockGetAvatars.mockReset();
  });

  it('returns the correct ENS avatars and loading state', async () => {
    const testEnsNames = ['test1.ens', 'test2.ens'];
    const testEnsAvatars = ['avatarUrl1', 'avatarUrl2'];

    mockGetAvatars.mockResolvedValue(testEnsAvatars);

    const { result } = renderHook(
      () => useAvatars({ ensNames: testEnsNames }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(testEnsAvatars);
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetAvatars).toHaveBeenCalledWith({ ensNames: testEnsNames, chain: mainnet });
  });

  it('returns the loading state true while still fetching ENS avatars', async () => {
    const testEnsNames = ['test1.ens', 'test2.ens'];

    // Don't resolve the promise immediately
    mockGetAvatars.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(
      () => useAvatars({ ensNames: testEnsNames }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    expect(result.current.data).toBe(undefined);
    expect(result.current.isLoading).toBe(true);
  });

  it('returns correct base mainnet avatars', async () => {
    const testEnsNames = ['shrek.base.eth', 'donkey.base.eth'];
    const testEnsAvatars = ['shrekface', 'donkeyface'];

    mockGetAvatars.mockResolvedValue(testEnsAvatars);

    const { result } = renderHook(
      () =>
        useAvatars({
          ensNames: testEnsNames,
          chain: base as unknown as typeof mainnet,
        }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(testEnsAvatars);
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetAvatars).toHaveBeenCalledWith({ ensNames: testEnsNames, chain: base });
  });

  it('returns correct base sepolia avatars', async () => {
    const testEnsNames = ['shrek.basetest.eth', 'donkey.basetest.eth'];
    const testEnsAvatars = ['shrektestface', 'donkeytestface'];

    mockGetAvatars.mockResolvedValue(testEnsAvatars);

    const { result } = renderHook(
      () =>
        useAvatars({
          ensNames: testEnsNames,
          chain: baseSepolia as unknown as typeof mainnet,
        }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(testEnsAvatars);
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockGetAvatars).toHaveBeenCalledWith({ ensNames: testEnsNames, chain: baseSepolia });
  });

  it('returns error for unsupported chain', async () => {
    const testEnsNames = ['shrek.basetest.eth', 'donkey.basetest.eth'];

    mockGetAvatars.mockRejectedValue('ChainId not supported, avatar resolution is only supported on Ethereum and Base.');

    const { result } = renderHook(
      () =>
        useAvatars({
          ensNames: testEnsNames,
          chain: optimism as unknown as typeof mainnet,
        }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toBe(undefined);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(
        'ChainId not supported, avatar resolution is only supported on Ethereum and Base.',
      );
    });
  });

  it('respects the enabled option in queryOptions', async () => {
    const testEnsNames = ['test1.ens', 'test2.ens'];
    const testEnsAvatars = ['avatarUrl1', 'avatarUrl2'];

    mockGetAvatars.mockResolvedValue(testEnsAvatars);

    const { result } = renderHook(
      () => useAvatars({ ensNames: testEnsNames }, { enabled: false }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetched).toBe(false);
    expect(mockGetAvatars).not.toHaveBeenCalled();
  });

  it('uses the default query options when no queryOptions are provided', async () => {
    const testEnsNames = ['test1.ens', 'test2.ens'];
    const testEnsAvatars = ['avatarUrl1', 'avatarUrl2'];

    mockGetAvatars.mockResolvedValue(testEnsAvatars);

    renderHook(() => useAvatars({ ensNames: testEnsNames }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => {
      expect(mockGetAvatars).toHaveBeenCalled();
    });
  });

  it('merges custom queryOptions with default options', async () => {
    const testEnsNames = ['test1.ens', 'test2.ens'];
    const testEnsAvatars = ['avatarUrl1', 'avatarUrl2'];
    const customStaleTime = 60000;

    mockGetAvatars.mockResolvedValue(testEnsAvatars);

    const { result } = renderHook(
      () =>
        useAvatars({ ensNames: testEnsNames }, { staleTime: customStaleTime }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(testEnsAvatars);
    });

    expect(mockGetAvatars).toHaveBeenCalled();
  });

  it('handles empty ensNames array', async () => {
    const { result } = renderHook(() => useAvatars({ ensNames: [] }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetched).toBe(false);
    expect(mockGetAvatars).not.toHaveBeenCalled();
  });

  it('creates a stable query key based on ensNames', async () => {
    const testEnsNames1 = ['test1.ens', 'test2.ens'];
    const testEnsNames2 = ['test1.ens', 'test3.ens'];
    const testEnsAvatars = ['avatarUrl1', 'avatarUrl2'];

    mockGetAvatars.mockResolvedValue(testEnsAvatars);

    const { rerender } = renderHook(
      ({ ensNames }) => useAvatars({ ensNames }),
      {
        wrapper: getNewReactQueryTestProvider(),
        initialProps: { ensNames: testEnsNames1 },
      },
    );

    await waitFor(() => {
      expect(mockGetAvatars).toHaveBeenCalled();
    });

    mockGetAvatars.mockClear();

    rerender({ ensNames: testEnsNames2 });

    await waitFor(() => {
      expect(mockGetAvatars).toHaveBeenCalled();
    });
  });

  it('handles partial failures in avatar resolution', async () => {
    const testEnsNames = ['success1.eth', 'fail.eth', 'success2.eth'];

    const partialResults = ['avatar1-url', null, 'avatar2-url'];
    mockGetAvatars.mockResolvedValue(partialResults);

    const { result } = renderHook(
      () => useAvatars({ ensNames: testEnsNames }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(partialResults);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    expect(mockGetAvatars).toHaveBeenCalledWith({ ensNames: testEnsNames, chain: mainnet });
  });

  it('disables the query when ensNames array is empty', async () => {
    mockGetAvatars.mockImplementation(() => {
      throw new Error('This should not be called');
    });

    const { result } = renderHook(() => useAvatars({ ensNames: [] }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockGetAvatars).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('enables the query when enabled=true is explicitly set and ensNames is valid', async () => {
    const testEnsNames = ['test1.ens', 'test2.ens'];
    const testEnsAvatars = ['avatarUrl1', 'avatarUrl2'];

    mockGetAvatars.mockResolvedValue(testEnsAvatars);

    const { result } = renderHook(
      () => useAvatars({ ensNames: testEnsNames }, { enabled: true }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(testEnsAvatars);
    });

    expect(mockGetAvatars).toHaveBeenCalled();
  });

  it('respects enabled=false even with valid ensNames', async () => {
    const testEnsNames = ['test1.ens', 'test2.ens'];

    mockGetAvatars.mockImplementation(() => {
      throw new Error('This should not be called');
    });

    const { result } = renderHook(
      () => useAvatars({ ensNames: testEnsNames }, { enabled: false }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockGetAvatars).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('correctly maps cacheTime to gcTime for backwards compatibility', async () => {
    const testEnsNames = ['test1.ens'];
    const testEnsAvatar = 'avatarUrl1';
    const mockCacheTime = 60000;

    mockGetAvatars.mockResolvedValue([testEnsAvatar]);

    renderHook(
      () =>
        useAvatars({ ensNames: testEnsNames }, { cacheTime: mockCacheTime }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    expect(mockUseQuery).toHaveBeenCalled();
    const optionsWithCacheTime = mockUseQuery.mock.calls[0][0];
    expect(optionsWithCacheTime).toHaveProperty('gcTime', mockCacheTime);

    const mockGcTime = 120000;

    mockUseQuery.mockClear();

    renderHook(
      () =>
        useAvatars(
          {
            ensNames: testEnsNames,
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

    expect(mockUseQuery).toHaveBeenCalled();
    const optionsWithBoth = mockUseQuery.mock.calls[0][0];
    expect(optionsWithBoth).toHaveProperty('gcTime', mockGcTime);
  });
});
