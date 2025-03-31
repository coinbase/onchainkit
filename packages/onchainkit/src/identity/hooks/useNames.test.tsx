import { publicClient } from '@/core/network/client';
import { renderHook, waitFor } from '@testing-library/react';
import type { Address } from 'viem';
import { base, mainnet, optimism } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getNames } from '../utils/getNames';
import { getNewReactQueryTestProvider } from './getNewReactQueryTestProvider';
import { useNames } from './useNames';

vi.mock('@/core/network/client');
vi.mock('@/core/network/getChainPublicClient', () => ({
  ...vi.importActual('@/core/network/getChainPublicClient'),
  getChainPublicClient: vi.fn(() => publicClient),
}));

vi.mock('../utils/getNames');

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

describe('useNames', () => {
  const testAddresses = [
    '0x1234567890123456789012345678901234567890',
    '0x2345678901234567890123456789012345678901',
    '0x3456789012345678901234567890123456789012',
  ] as Address[];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    mockUseQuery.mockClear();
  });

  it('returns the correct ENS names and loading state', async () => {
    const testEnsNames = ['user1.eth', 'user2.eth', 'user3.eth'];

    vi.mocked(getNames).mockResolvedValue(testEnsNames);

    const { result } = renderHook(
      () => useNames({ addresses: testAddresses }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBe(undefined);

    await waitFor(() => {
      expect(result.current.data).toEqual(testEnsNames);
      expect(result.current.isPending).toBe(false);
    });

    expect(getNames).toHaveBeenCalledWith({
      addresses: testAddresses,
      chain: mainnet,
    });
  });

  it('returns the correct names for custom chain', async () => {
    const testBaseNames = ['user1.base', 'user2.base', 'user3.base'];

    vi.mocked(getNames).mockResolvedValue(testBaseNames);

    const { result } = renderHook(
      () =>
        useNames({
          addresses: testAddresses,
          chain: base,
        }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(testBaseNames);
      expect(result.current.isPending).toBe(false);
    });

    expect(getNames).toHaveBeenCalledWith({
      addresses: testAddresses,
      chain: base,
    });
  });

  it('returns error for unsupported chain', async () => {
    const errorMessage =
      'ChainId not supported, name resolution is only supported on Ethereum and Base.';
    vi.mocked(getNames).mockRejectedValue(errorMessage);

    const { result } = renderHook(
      () =>
        useNames({
          addresses: testAddresses,
          chain: optimism,
        }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toBe(undefined);
      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it('is disabled when addresses array is empty', async () => {
    vi.mocked(getNames).mockImplementation(() => {
      throw new Error('This should not be called');
    });

    const { result } = renderHook(() => useNames({ addresses: [] }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(getNames).not.toHaveBeenCalled();
    expect(result.current.isError).toBe(false);
  });

  it('uses the default query options when no queryOptions are provided', async () => {
    const testEnsNames = ['user1.eth', 'user2.eth', 'user3.eth'];

    vi.mocked(getNames).mockResolvedValue(testEnsNames);

    renderHook(() => useNames({ addresses: testAddresses }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => {
      expect(getNames).toHaveBeenCalled();
    });
  });

  it('merges custom queryOptions with default options', async () => {
    const testEnsNames = ['user1.eth', 'user2.eth', 'user3.eth'];
    const customCacheTime = 120000;

    vi.mocked(getNames).mockResolvedValue(testEnsNames);

    const { result } = renderHook(
      () => useNames({ addresses: testAddresses }, { gcTime: customCacheTime }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(testEnsNames);
    });

    expect(getNames).toHaveBeenCalled();
  });

  it('creates a stable query key based on addresses and chain', async () => {
    const testEnsNames = ['user1.eth', 'user2.eth', 'user3.eth'];
    vi.mocked(getNames).mockResolvedValue(testEnsNames);

    const { result, rerender } = renderHook(
      (props: { addresses: Address[] }) =>
        useNames({ addresses: props.addresses }),
      {
        wrapper: getNewReactQueryTestProvider(),
        initialProps: { addresses: testAddresses },
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(testEnsNames);
    });

    vi.clearAllMocks();

    rerender({ addresses: [...testAddresses] });

    expect(getNames).not.toHaveBeenCalled();
  });

  it('handles partial failures in name resolution', async () => {
    const partialResults = [null, null, null];
    vi.mocked(getNames).mockResolvedValue(partialResults);

    const { result } = renderHook(
      () => useNames({ addresses: testAddresses }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(partialResults);
      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    expect(getNames).toHaveBeenCalledWith({
      addresses: testAddresses,
      chain: mainnet,
    });
  });

  it('respects enabled=false in queryOptions even with valid addresses', async () => {
    vi.mocked(getNames).mockImplementation(() => {
      throw new Error('This should not be called');
    });

    const { result } = renderHook(
      () => useNames({ addresses: testAddresses }, { enabled: false }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(getNames).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('enables the query when enabled=true and addresses are valid', async () => {
    const testEnsNames = ['user1.eth', 'user2.eth', 'user3.eth'];
    vi.mocked(getNames).mockResolvedValue(testEnsNames);

    const { result } = renderHook(
      () => useNames({ addresses: testAddresses }, { enabled: true }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(testEnsNames);
    });

    expect(getNames).toHaveBeenCalled();
  });

  it('correctly maps cacheTime to gcTime for backwards compatibility', async () => {
    const mockCacheTime = 60000;
    const testEnsNames = ['user1.eth', 'user2.eth', 'user3.eth'];

    vi.mocked(getNames).mockResolvedValue(testEnsNames);

    renderHook(
      () =>
        useNames({ addresses: testAddresses }, { cacheTime: mockCacheTime }),
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
        useNames(
          {
            addresses: testAddresses,
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
