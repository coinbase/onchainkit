import { publicClient } from '@/core/network/client';
import { renderHook, waitFor } from '@testing-library/react';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getAddresses } from '../utils/getAddresses';
import { getNewReactQueryTestProvider } from './getNewReactQueryTestProvider';
import { useAddresses } from './useAddresses';

vi.mock('@/core/network/client');

vi.mock('@/core/network/getChainPublicClient', () => ({
  ...vi.importActual('@/core/network/getChainPublicClient'),
  getChainPublicClient: vi.fn(() => publicClient),
}));

vi.mock('../utils/getAddresses');

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

describe('useAddresses', () => {
  const testNames = ['test.eth', 'test2.eth', 'shrek.base.eth'];
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

  it('returns the correct addresses and loading state', async () => {
    vi.mocked(getAddresses).mockResolvedValue(testAddresses);

    const { result } = renderHook(() => useAddresses({ names: testNames }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    expect(result.current.isPending).toBe(true);
    expect(result.current.data).toBe(undefined);

    await waitFor(() => {
      expect(result.current.data).toEqual(testAddresses);
      expect(result.current.isPending).toBe(false);
    });

    expect(getAddresses).toHaveBeenCalledWith({
      names: testNames,
    });
  });

  it('returns the correct addresses for different name inputs', async () => {
    vi.mocked(getAddresses).mockResolvedValue(testAddresses);

    const { result } = renderHook(
      () =>
        useAddresses({
          names: testNames,
        }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(testAddresses);
      expect(result.current.isPending).toBe(false);
    });

    expect(getAddresses).toHaveBeenCalledWith({
      names: testNames,
    });
  });

  it('returns error when name resolution fails', async () => {
    const errorMessage = 'Error resolving names';
    vi.mocked(getAddresses).mockRejectedValue(errorMessage);

    const { result } = renderHook(
      () =>
        useAddresses({
          names: testNames,
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

  it('is disabled when names array is empty', async () => {
    vi.mocked(getAddresses).mockImplementation(() => {
      throw new Error('This should not be called');
    });

    const { result } = renderHook(() => useAddresses({ names: [] }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(getAddresses).not.toHaveBeenCalled();
    expect(result.current.isError).toBe(false);
  });

  it('uses the default query options when no queryOptions are provided', async () => {
    vi.mocked(getAddresses).mockResolvedValue(testAddresses);

    renderHook(() => useAddresses({ names: testNames }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => {
      expect(getAddresses).toHaveBeenCalled();
    });

    const options = mockUseQuery.mock.calls[0][0];
    expect(options).toHaveProperty('queryKey');
    expect(options.queryKey).toEqual(['useAddresses', testNames.join(',')]);
  });

  it('merges custom queryOptions with default options', async () => {
    const customCacheTime = 120000;

    vi.mocked(getAddresses).mockResolvedValue(testAddresses);

    renderHook(
      () => useAddresses({ names: testNames }, { cacheTime: customCacheTime }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    expect(mockUseQuery).toHaveBeenCalled();
    const options = mockUseQuery.mock.calls[0][0];
    expect(options).toHaveProperty('gcTime', customCacheTime);
  });

  it('correctly maps cacheTime to gcTime for backwards compatibility', async () => {
    const mockCacheTime = 60000;
    const mockGcTime = 120000;

    vi.mocked(getAddresses).mockResolvedValue(testAddresses);

    renderHook(
      () => useAddresses({ names: testNames }, { cacheTime: mockCacheTime }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    expect(mockUseQuery).toHaveBeenCalled();
    const optionsWithCacheTime = mockUseQuery.mock.calls[0][0];
    expect(optionsWithCacheTime).toHaveProperty('gcTime', mockCacheTime);

    mockUseQuery.mockClear();

    renderHook(
      () =>
        useAddresses(
          { names: testNames },
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

  it('creates a stable query key based on names', async () => {
    vi.mocked(getAddresses).mockResolvedValue(testAddresses);

    const { result, rerender } = renderHook(
      (props: { names: string[] }) => useAddresses({ names: props.names }),
      {
        wrapper: getNewReactQueryTestProvider(),
        initialProps: { names: testNames },
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(testAddresses);
    });

    vi.clearAllMocks();

    rerender({ names: [...testNames] });

    expect(getAddresses).not.toHaveBeenCalled();
  });

  it('handles partial failures in address resolution', async () => {
    const partialResults = [testAddresses[0], null, testAddresses[2]];
    vi.mocked(getAddresses).mockResolvedValue(partialResults);

    const { result } = renderHook(() => useAddresses({ names: testNames }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(partialResults);
      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
    });

    expect(getAddresses).toHaveBeenCalledWith({
      names: testNames,
    });
  });

  it('respects enabled=false in queryOptions even with valid names', async () => {
    vi.mocked(getAddresses).mockImplementation(() => {
      throw new Error('This should not be called');
    });

    const { result } = renderHook(
      () => useAddresses({ names: testNames }, { enabled: false }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(getAddresses).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('enables the query when enabled=true and names are valid', async () => {
    vi.mocked(getAddresses).mockResolvedValue(testAddresses);

    const { result } = renderHook(
      () => useAddresses({ names: testNames }, { enabled: true }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(testAddresses);
      expect(result.current.isLoading).toBe(false);
    });

    expect(getAddresses).toHaveBeenCalledWith({
      names: testNames,
    });
  });

  it('handles empty results from getAddresses', async () => {
    vi.mocked(getAddresses).mockResolvedValue([]);

    const { result } = renderHook(() => useAddresses({ names: testNames }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([]);
      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });

  it('does not run query when names prop changes to empty array', async () => {
    vi.mocked(getAddresses).mockResolvedValue(testAddresses);

    const { result, rerender } = renderHook(
      (props: { names: string[] }) => useAddresses({ names: props.names }),
      {
        wrapper: getNewReactQueryTestProvider(),
        initialProps: { names: testNames },
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(testAddresses);
    });

    vi.clearAllMocks();
    rerender({ names: [] });

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(getAddresses).not.toHaveBeenCalled();
  });
});
