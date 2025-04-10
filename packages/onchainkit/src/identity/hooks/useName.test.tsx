import { publicClient } from '@/core/network/client';
/**
 * @vitest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react';
import { base, optimism } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getNewReactQueryTestProvider } from './getNewReactQueryTestProvider';
import { useName } from './useName';
import type { GetName } from '@/identity/types';

const mockGetName = vi.fn();
vi.mock('@/identity/utils/getName', () => ({
  getName: (...args: [GetName]) => mockGetName(...args),
}));

vi.mock('@/core/network/client');
vi.mock('@/core/network/getChainPublicClient', () => ({
  ...vi.importActual('@/core/network/getChainPublicClient'),
  getChainPublicClient: vi.fn(() => publicClient),
}));

const mockGetAddress = vi.fn();

vi.mock('@/identity/utils/getAddress', () => ({
  getAddress: mockGetAddress,
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

describe('useName', () => {
  const testAddress = '0x123';

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockClear();
    mockGetAddress.mockReset();
    mockGetName.mockReset();
  });

  it('returns the correct ENS name and loading state', async () => {
    const testEnsName = 'test.ens';
    mockGetName.mockResolvedValue(testEnsName);

    const { result } = renderHook(() => useName({ address: testAddress }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => {
      expect(result.current.data).toBe(testEnsName);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('returns the loading state true while still fetching from ens action', async () => {
    // Don't resolve the promise immediately
    mockGetName.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useName({ address: testAddress }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => {
      expect(result.current.data).toBe(undefined);
      expect(result.current.isLoading).toBe(true);
    });
  });

  it('returns the correct ENS name and loading state for custom chain ', async () => {
    const testEnsName = 'test.customchain.eth';
    mockGetName.mockResolvedValue(testEnsName);

    const { result } = renderHook(
      () => useName({ address: testAddress, chain: base }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toBe(testEnsName);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('default to ENS name if custom chain name is not registered', async () => {
    const testEnsName = 'ethereum.eth';
    mockGetName.mockResolvedValue(testEnsName);

    const { result } = renderHook(
      () => useName({ address: testAddress, chain: base }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toBe(testEnsName);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('returns null when a name fails bidirectional validation', async () => {
    mockGetName.mockResolvedValue(null);

    const { result } = renderHook(() => useName({ address: testAddress }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => {
      expect(result.current.data).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('returns error for unsupported chain ', async () => {
    mockGetName.mockRejectedValue(
      'ChainId not supported, name resolution is only supported on Ethereum and Base.',
    );

    const { result } = renderHook(
      () => useName({ address: testAddress, chain: optimism }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toBe(undefined);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(
        'ChainId not supported, name resolution is only supported on Ethereum and Base.',
      );
    });
  });

  it('respects the enabled option in queryOptions', async () => {
    const testEnsName = 'test.ens';
    mockGetName.mockResolvedValue(testEnsName);

    const { result } = renderHook(
      () => useName({ address: testAddress }, { enabled: false }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetched).toBe(false);
    expect(mockGetName).not.toHaveBeenCalled();
  });

  it('uses the default query options when no queryOptions are provided', async () => {
    const testEnsName = 'test.ens';
    mockGetName.mockResolvedValue(testEnsName);

    renderHook(() => useName({ address: testAddress }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => {
      expect(mockGetName).toHaveBeenCalled();
    });
  });

  it('merges custom queryOptions with default options', async () => {
    const testEnsName = 'test.ens';
    const customGcTime = 120000;
    mockGetName.mockResolvedValue(testEnsName);

    const { result } = renderHook(
      () => useName({ address: testAddress }, { gcTime: customGcTime }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toBe(testEnsName);
    });

    expect(mockGetName).toHaveBeenCalled();
  });

  it('disables the query when address is empty', async () => {
    mockGetName.mockImplementation(() => {
      throw new Error('This should not be called');
    });

    const { result } = renderHook(
      () => useName({ address: '' as unknown as `0x${string}` }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockGetName).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('enables the query when enabled=true is explicitly set and address is valid', async () => {
    const testEnsName = 'test.ens';
    mockGetName.mockResolvedValue(testEnsName);

    const { result } = renderHook(
      () => useName({ address: testAddress }, { enabled: true }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toBe(testEnsName);
    });

    expect(mockGetName).toHaveBeenCalled();
  });

  it('respects enabled=false even with valid address', async () => {
    mockGetName.mockImplementation(() => {
      throw new Error('This should not be called');
    });

    const { result } = renderHook(
      () => useName({ address: testAddress }, { enabled: false }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockGetName).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('correctly maps cacheTime to gcTime for backwards compatibility', async () => {
    const mockCacheTime = 60000;
    const testEnsName = 'test.ens';
    mockGetName.mockResolvedValue(testEnsName);

    renderHook(
      () => useName({ address: testAddress }, { cacheTime: mockCacheTime }),
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
        useName(
          {
            address: testAddress,
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
