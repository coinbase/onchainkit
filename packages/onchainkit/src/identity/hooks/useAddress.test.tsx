import { publicClient } from '@/core/network/client';
import { renderHook, waitFor } from '@testing-library/react';
import { base, baseSepolia } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getNewReactQueryTestProvider } from './getNewReactQueryTestProvider';
import { useAddress } from './useAddress';

vi.mock('@/core/network/client');

vi.mock('@/core/network/getChainPublicClient', () => ({
  ...vi.importActual('@/core/network/getChainPublicClient'),
  getChainPublicClient: vi.fn(() => publicClient),
}));

const mockUseQuery = vi.fn();
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type UseQueryFunctionType = <TData, TError = Error>(options: {
    queryKey: unknown[];
    queryFn: () => Promise<TData>;
    [key: string]: unknown;
  }) => unknown;

  return {
    ...actual,
    useQuery: <TData, _TError = Error>(options: {
      queryKey: unknown[];
      queryFn: () => Promise<TData>;
      [key: string]: unknown;
    }) => {
      mockUseQuery(options);
      return (actual.useQuery as UseQueryFunctionType)<TData, _TError>(options);
    },
  };
});

describe('useAddress', () => {
  const mockGetEnsAddress = publicClient.getEnsAddress as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockClear();
  });

  it('should return the correct address and loading state', async () => {
    const testEnsName = 'test.ens';
    const testEnsAddress = '0x1234';
    mockGetEnsAddress.mockResolvedValue(testEnsAddress);
    const { result } = renderHook(() => useAddress({ name: testEnsName }), {
      wrapper: getNewReactQueryTestProvider(),
    });
    await waitFor(() => {
      expect(result.current.data).toBe(testEnsAddress);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should return the loading state true while still fetching ENS address', async () => {
    const testEnsName = 'test.ens';
    const { result } = renderHook(() => useAddress({ name: testEnsName }), {
      wrapper: getNewReactQueryTestProvider(),
    });
    await waitFor(() => {
      expect(result.current.data).toBe(undefined);
      expect(result.current.isLoading).toBe(true);
    });
  });

  it('should return correct base mainnet address', async () => {
    const testEnsName = 'shrek.base.eth';
    const testEnsAddress = '0x1234';
    mockGetEnsAddress.mockResolvedValue(testEnsAddress);
    const { result } = renderHook(
      () => useAddress({ name: testEnsName, chain: base }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );
    await waitFor(() => {
      expect(result.current.data).toBe(testEnsAddress);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should return correct base sepolia address', async () => {
    const testEnsName = 'shrek.basetest.eth';
    const testEnsAddress = '0x1234';
    mockGetEnsAddress.mockResolvedValue(testEnsAddress);
    const { result } = renderHook(
      () => useAddress({ name: testEnsName, chain: baseSepolia }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );
    await waitFor(() => {
      expect(result.current.data).toBe(testEnsAddress);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('correctly maps cacheTime to gcTime for backwards compatibility', async () => {
    const testName = 'test.ens';
    const testAddress = '0x1234';
    const mockCacheTime = 60000;

    mockGetEnsAddress.mockResolvedValue(testAddress);

    renderHook(
      () => useAddress({ name: testName }, { cacheTime: mockCacheTime }),
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
        useAddress(
          {
            name: testName,
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
