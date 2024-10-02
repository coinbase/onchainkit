import { renderHook, waitFor } from '@testing-library/react';
import { useTrendingMint } from './useTrendingMint';
import { getTrendingMint } from '../utils/getTrendingMint';
import { getNewReactQueryTestProvider } from '../../identity/hooks/getNewReactQueryTestProvider';
import { type Mock, beforeEach, describe, it, expect, vi } from 'vitest';

vi.mock('../utils/getTrendingMint');

describe('useTrendingMint', () => {
  const address = '0x123';
  const takerAddress = '0x456';
  const network = 'mainnet';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch trending mint data successfully', async () => {
    const mockData = { data: 'mockData' };
    (getTrendingMint as Mock).mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useTrendingMint({ address, takerAddress, network }),
      { wrapper: getNewReactQueryTestProvider() },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
      expect(getTrendingMint).toHaveBeenCalledWith(
        address,
        takerAddress,
        network,
      );
    });
  });

  it('should not fetch data if address or takerAddress is missing', async () => {
    renderHook(() => useTrendingMint({ address: '', takerAddress, network }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    expect(getTrendingMint).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const mockError = new Error('Failed to fetch');
    (getTrendingMint as Mock).mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useTrendingMint({ address, takerAddress, network }),
      { wrapper: getNewReactQueryTestProvider() },
    );

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });
  });

  it('should respect query options', async () => {
    const mockData = { data: 'mockData' };
    (getTrendingMint as Mock).mockResolvedValue(mockData);

    const { result } = renderHook(
      () =>
        useTrendingMint({ address, takerAddress, network }, { enabled: false }),
      { wrapper: getNewReactQueryTestProvider() },
    );

    result.current.refetch();

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
      expect(getTrendingMint).toHaveBeenCalledWith(
        address,
        takerAddress,
        network,
      );
    });
  });
});
