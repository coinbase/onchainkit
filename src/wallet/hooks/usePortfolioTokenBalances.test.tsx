import { getPortfolioTokenBalances } from '@/api/getPortfolioTokenBalances';
import type {
  PortfolioTokenBalances,
  PortfolioTokenWithFiatValue,
} from '@/api/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePortfolioTokenBalances } from './usePortfolioTokenBalances';

vi.mock('@/api/getPortfolioTokenBalances');

const mockAddress: `0x${string}` = '0x123';
const mockTokens: PortfolioTokenWithFiatValue[] = [
  {
    address: '0x123',
    chainId: 8453,
    decimals: 6,
    image: '',
    name: 'Token',
    symbol: 'TOKEN',
    cryptoBalance: 100,
    fiatBalance: 100,
  },
];
const mockPortfolioTokenBalances: PortfolioTokenBalances = {
  address: mockAddress,
  portfolioBalanceInUsd: 100,
  tokenBalances: mockTokens,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePortfolioTokenBalances', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch token balances successfully', async () => {
    vi.mocked(getPortfolioTokenBalances).mockResolvedValueOnce({
      portfolios: [mockPortfolioTokenBalances],
    });

    const { result } = renderHook(
      () => usePortfolioTokenBalances({ address: mockAddress }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getPortfolioTokenBalances).toHaveBeenCalledWith({
      addresses: [mockAddress],
    });

    expect(result.current.data).toEqual(mockPortfolioTokenBalances);
  });

  it('should handle API errors', async () => {
    vi.mocked(getPortfolioTokenBalances).mockResolvedValueOnce({
      code: 'API Error',
      error: 'API Error',
      message: 'API Error',
    });

    const { result } = renderHook(
      () => usePortfolioTokenBalances({ address: mockAddress }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('API Error');
  });

  it('should not fetch when address is empty', () => {
    renderHook(
      () => usePortfolioTokenBalances({ address: '' as `0x${string}` }),
      {
        wrapper: createWrapper(),
      },
    );

    expect(getPortfolioTokenBalances).not.toHaveBeenCalled();
  });

  it('should not fetch when address is undefined', () => {
    renderHook(() => usePortfolioTokenBalances({ address: undefined }), {
      wrapper: createWrapper(),
    });

    expect(getPortfolioTokenBalances).not.toHaveBeenCalled();
  });

  it('should return empty data when portfolios is empty', async () => {
    vi.mocked(getPortfolioTokenBalances).mockResolvedValueOnce({
      portfolios: [],
    });

    const { result } = renderHook(
      () => usePortfolioTokenBalances({ address: mockAddress }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      address: '0x123',
      portfolioBalanceUsd: 0,
      tokenBalances: [],
    });
  });
});
