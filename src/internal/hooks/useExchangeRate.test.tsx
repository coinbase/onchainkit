import { getPriceQuote } from '@/api';
import type { PriceQuoteToken } from '@/api/types';
import { getNewReactQueryTestProvider } from '@/identity/hooks/getNewReactQueryTestProvider';
import { ethToken } from '@/token/constants';
import { renderHook, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useExchangeRate } from './useExchangeRate';

vi.mock('@/api', () => ({
  getPriceQuote: vi.fn(),
}));

describe('useExchangeRate', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return nullish values without calling setExchangeRate if a token is not provided', async () => {
    const mockSetExchangeRate = vi.fn();
    const { result } = renderHook(
      () =>
        useExchangeRate({
          token: undefined as unknown as PriceQuoteToken,
          selectedInputType: 'crypto',
        }),
      { wrapper: getNewReactQueryTestProvider() },
    );

    const resolvedValue = await result.current;
    expect(resolvedValue).toEqual({
      isLoading: false,
      exchangeRate: 0,
      error: null,
    });
    expect(mockSetExchangeRate).not.toHaveBeenCalled();
  });

  it('should set the correct exchange rate when the selected input type is crypto', async () => {
    (getPriceQuote as Mock).mockResolvedValue({
      priceQuotes: [
        {
          name: 'ETH',
          symbol: 'ETH',
          contractAddress: '',
          price: '2400',
          timestamp: 1714761600,
        },
      ],
    });

    const { result } = renderHook(
      () =>
        useExchangeRate({
          token: ethToken.symbol as PriceQuoteToken,
          selectedInputType: 'crypto',
        }),
      { wrapper: getNewReactQueryTestProvider() },
    );

    await waitFor(() => {
      expect(result.current.exchangeRate).toEqual(1 / 2400);
    });
  });

  it('should set the correct the exchange rate when the selected input type is fiat', async () => {
    (getPriceQuote as Mock).mockResolvedValue({
      priceQuotes: [
        {
          name: 'ETH',
          symbol: 'ETH',
          contractAddress: '',
          price: '2400',
          timestamp: 1714761600,
        },
      ],
    });

    const { result } = renderHook(
      () =>
        useExchangeRate({
          token: ethToken.symbol as PriceQuoteToken,
          selectedInputType: 'fiat',
        }),
      { wrapper: getNewReactQueryTestProvider() },
    );

    await waitFor(() => {
      expect(result.current.exchangeRate).toEqual(2400);
    });
  });

  it('should log an error and not set the exchange rate when the api call returns an error', async () => {
    (getPriceQuote as Mock).mockResolvedValue({
      error: 'test error',
    });

    const { result } = renderHook(
      () =>
        useExchangeRate({
          token: ethToken.symbol as PriceQuoteToken,
          selectedInputType: 'fiat',
        }),
      { wrapper: getNewReactQueryTestProvider() },
    );

    await waitFor(() => {
      expect(result.current.error).toEqual({ error: 'test error' });
    });
  });

  it('should log an error and not set the exchange rate when the api fails', async () => {
    (getPriceQuote as Mock).mockRejectedValue(new Error('test error'));

    const { result } = renderHook(
      () =>
        useExchangeRate({
          token: ethToken.symbol as PriceQuoteToken,
          selectedInputType: 'fiat',
        }),
      { wrapper: getNewReactQueryTestProvider() },
    );

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toEqual('test error');
    });
  });

  it('should set and unset loading state', async () => {
    (getPriceQuote as Mock).mockResolvedValue({
      priceQuotes: [
        {
          name: 'ETH',
          symbol: 'ETH',
          contractAddress: '',
          price: '2400',
          timestamp: 1714761600,
        },
      ],
    });

    const { result } = renderHook(
      () =>
        useExchangeRate({
          token: ethToken.symbol as PriceQuoteToken,
          selectedInputType: 'crypto',
        }),
      { wrapper: getNewReactQueryTestProvider() },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toEqual(true);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toEqual(false);
    });
  });
});
