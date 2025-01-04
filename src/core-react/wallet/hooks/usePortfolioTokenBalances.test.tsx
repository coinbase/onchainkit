import { getPortfolioTokenBalances } from '@/core/api/getPortfolioTokenBalances';
import type {
  PortfolioTokenBalances,
  PortfolioTokenWithFiatValue,
} from '@/core/api/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePortfolioTokenBalances } from './usePortfolioTokenBalances';

vi.mock('@/core/api/getPortfolioTokenBalances');

const mockAddresses: `0x${string}`[] = ['0x123'];
const mockTokens: PortfolioTokenWithFiatValue[] = [
  {
    address: '0x123',
    chainId: 8453,
    decimals: 6,
    image: '',
    name: 'Token',
    symbol: 'TOKEN',
    crypto_balance: 100,
    fiat_balance: 100,
  },
];
const mockPortfolioTokenBalances: PortfolioTokenBalances[] = [
  {
    address: mockAddresses[0],
    token_balances: mockTokens,
    portfolio_balance_usd: 100,
  },
];

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
      tokens: mockPortfolioTokenBalances,
    });

    const { result } = renderHook(
      () => usePortfolioTokenBalances({ addresses: mockAddresses }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPortfolioTokenBalances);
    expect(getPortfolioTokenBalances).toHaveBeenCalledWith({
      addresses: mockAddresses,
    });
  });

  it('should handle API errors', async () => {
    vi.mocked(getPortfolioTokenBalances).mockResolvedValueOnce({
      code: 'API Error',
      error: 'API Error',
      message: 'API Error',
    });

    const { result } = renderHook(
      () => usePortfolioTokenBalances({ addresses: mockAddresses }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('API Error');
  });

  it('should not fetch when addresses is empty', () => {
    renderHook(() => usePortfolioTokenBalances({ addresses: [] }), {
      wrapper: createWrapper(),
    });

    expect(getPortfolioTokenBalances).not.toHaveBeenCalled();
  });

  it('should not fetch when addresses is undefined', () => {
    renderHook(() => usePortfolioTokenBalances({ addresses: undefined }), {
      wrapper: createWrapper(),
    });

    expect(getPortfolioTokenBalances).not.toHaveBeenCalled();
  });
});
