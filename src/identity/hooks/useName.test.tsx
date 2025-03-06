import { publicClient } from '@/core/network/client';
/**
 * @vitest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react';
import { base, optimism } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import { getNewReactQueryTestProvider } from './getNewReactQueryTestProvider';
import { useName } from './useName';

vi.mock('@/core/network/client');
vi.mock('@/core/network/getChainPublicClient', () => ({
  ...vi.importActual('@/core/network/getChainPublicClient'),
  getChainPublicClient: vi.fn(() => publicClient),
}));

describe('useName', () => {
  const mockGetEnsName = publicClient.getEnsName as Mock;
  const mockReadContract = publicClient.readContract as Mock;
  const testAddress = '0x123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the correct ENS name and loading state', async () => {
    const testEnsName = 'test.ens';

    mockGetEnsName.mockResolvedValue(testEnsName);

    const { result } = renderHook(() => useName({ address: testAddress }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => {
      expect(result.current.data).toBe(testEnsName);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('returns the loading state true while still fetching from ens action', async () => {
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

    mockReadContract.mockResolvedValue(testEnsName);

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
    const testCustomChainEnsName = undefined;
    const testEnsName = 'ethereum.eth';

    mockReadContract.mockResolvedValue(testCustomChainEnsName);
    mockGetEnsName.mockResolvedValue(testEnsName);

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

  it('returns error for unsupported chain ', async () => {
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

    mockGetEnsName.mockResolvedValue(testEnsName);

    const { result } = renderHook(
      () => useName({ address: testAddress }, { enabled: false }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetched).toBe(false);
    expect(mockGetEnsName).not.toHaveBeenCalled();
  });

  it('uses the default query options when no queryOptions are provided', async () => {
    const testEnsName = 'test.ens';

    mockGetEnsName.mockResolvedValue(testEnsName);

    renderHook(() => useName({ address: testAddress }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => {
      expect(mockGetEnsName).toHaveBeenCalled();
    });
  });

  it('merges custom queryOptions with default options', async () => {
    const testEnsName = 'test.ens';
    const customCacheTime = 120000;

    mockGetEnsName.mockResolvedValue(testEnsName);

    const { result } = renderHook(
      () => useName({ address: testAddress }, { cacheTime: customCacheTime }),
      {
        wrapper: getNewReactQueryTestProvider(),
      },
    );

    await waitFor(() => {
      expect(result.current.data).toBe(testEnsName);
    });

    expect(mockGetEnsName).toHaveBeenCalled();
  });
});
