import { getPortfolios } from '@/api/getPortfolios';
import type { Portfolio, PortfolioTokenWithFiatValue } from '@/api/types';
import { RequestContext } from '@/core/network/constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePortfolio } from './usePortfolio';

vi.mock('@/api/getPortfolios');

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
const mockPortfolio: Portfolio = {
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
  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

describe('usePortfolio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch token balances successfully', async () => {
    vi.mocked(getPortfolios).mockResolvedValueOnce({
      portfolios: [mockPortfolio],
    });

    const { result } = renderHook(
      () => usePortfolio({ address: mockAddress }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getPortfolios).toHaveBeenCalledWith(
      {
        addresses: [mockAddress],
      },
      RequestContext.Hook,
    );

    expect(result.current.data).toEqual(mockPortfolio);
  });

  it('should handle API errors', async () => {
    vi.mocked(getPortfolios).mockResolvedValueOnce({
      code: 'API Error',
      error: 'API Error',
      message: 'API Error',
    });

    const { result } = renderHook(
      () => usePortfolio({ address: mockAddress }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('API Error');
  });

  it('should not fetch when address is empty', () => {
    renderHook(() => usePortfolio({ address: '' as `0x${string}` }), {
      wrapper: createWrapper(),
    });

    expect(getPortfolios).not.toHaveBeenCalled();
  });

  it('should not fetch when enabled is false', () => {
    renderHook(() => usePortfolio({ address: mockAddress, enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(getPortfolios).not.toHaveBeenCalled();
  });

  it('should not fetch when address is undefined', () => {
    renderHook(() => usePortfolio({ address: undefined }), {
      wrapper: createWrapper(),
    });

    expect(getPortfolios).not.toHaveBeenCalled();
  });

  it('should return empty data when portfolios is empty', async () => {
    vi.mocked(getPortfolios).mockResolvedValueOnce({
      portfolios: [],
    });

    const { result } = renderHook(
      () => usePortfolio({ address: mockAddress }),
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
