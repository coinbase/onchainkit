import { getPriceQuote } from '@/api';
import { RequestContext } from '@/core/network/constants';
import { getNewReactQueryTestProvider } from '@/identity/hooks/getNewReactQueryTestProvider';
import { QueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePriceQuote } from './usePriceQuote';

vi.mock('@/api', () => ({
  getPriceQuote: vi.fn(),
}));

vi.mock('@/internal/utils/isApiResponseError', () => ({
  isApiError: vi.fn((response) => response.error !== undefined),
}));

describe('usePriceQuote', () => {
  let queryClient: QueryClient;
  const mockPriceQuote = {
    name: 'ETH',
    symbol: 'ETH',
    contractAddress: '' as `0x${string}`,
    price: '2400',
    timestamp: 1714761600,
  };
  const mockPriceQuoteResponse = {
    priceQuotes: [mockPriceQuote],
  };

  const mockError = {
    code: 'API_ERROR',
    error: 'API Error',
    message: 'API Error Message',
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  it('should return empty price quotes when token is undefined', async () => {
    const { result } = renderHook(() => usePriceQuote({ token: undefined }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({ priceQuotes: [] });
    expect(getPriceQuote).not.toHaveBeenCalled();
  });

  it('should fetch price quote when token is provided', async () => {
    vi.mocked(getPriceQuote).mockResolvedValue(mockPriceQuoteResponse);

    const { result } = renderHook(() => usePriceQuote({ token: 'ETH' }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getPriceQuote).toHaveBeenCalledWith(
      { tokens: ['ETH'] },
      RequestContext.Hook,
    );
    expect(result.current.data).toEqual(mockPriceQuoteResponse);
  });

  it('should throw error when API returns an error', async () => {
    vi.mocked(getPriceQuote).mockResolvedValue(mockError);

    const { result } = renderHook(() => usePriceQuote({ token: 'ETH' }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(getPriceQuote).toHaveBeenCalledWith(
      { tokens: ['ETH'] },
      RequestContext.Hook,
    );
    expect(result.current.error).toEqual(mockError);
  });

  it('should use custom request context when provided', async () => {
    vi.mocked(getPriceQuote).mockResolvedValue(mockPriceQuoteResponse);

    const { result } = renderHook(
      () => usePriceQuote({ token: 'ETH' }, RequestContext.Wallet),
      { wrapper: getNewReactQueryTestProvider() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getPriceQuote).toHaveBeenCalledWith(
      { tokens: ['ETH'] },
      RequestContext.Wallet,
    );
    expect(result.current.data).toEqual(mockPriceQuoteResponse);
  });

  it('should use default query options when not provided', async () => {
    vi.mocked(getPriceQuote).mockResolvedValue(mockPriceQuoteResponse);

    const { result } = renderHook(() => usePriceQuote({ token: 'ETH' }), {
      wrapper: getNewReactQueryTestProvider(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check that the hook is using the default options
    expect(queryClient.getQueryDefaults(['getPriceQuote', 'ETH'])).toEqual({});
  });

  it('should use custom query options when provided', async () => {
    vi.mocked(getPriceQuote).mockResolvedValue(mockPriceQuoteResponse);

    const customOptions = {
      staleTime: 60000,
      gcTime: 300000,
      refetchOnWindowFocus: false,
    };

    const { result } = renderHook(
      () =>
        usePriceQuote({
          token: 'ETH',
          queryOptions: customOptions,
        }),
      { wrapper: getNewReactQueryTestProvider() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getPriceQuote).toHaveBeenCalledWith(
      { tokens: ['ETH'] },
      RequestContext.Hook,
    );
    expect(result.current.data).toEqual(mockPriceQuoteResponse);
  });

  it('should disable the query when enabled is false', async () => {
    renderHook(
      () =>
        usePriceQuote({
          token: 'ETH',
          queryOptions: { enabled: false },
        }),
      { wrapper: getNewReactQueryTestProvider() },
    );

    expect(getPriceQuote).not.toHaveBeenCalled();
  });
});
