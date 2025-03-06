import { getPriceQuote } from '@/api';
import type { PriceQuoteToken } from '@/api/types';
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

  it('should return undefined without calling setExchangeRate if a token is not provided', async () => {
    const mockSetExchangeRate = vi.fn();
    const { result } = renderHook(() =>
      useExchangeRate({
        token: undefined as unknown as PriceQuoteToken,
        selectedInputType: 'crypto',
        setExchangeRate: mockSetExchangeRate,
        setExchangeRateLoading: vi.fn(),
      }),
    );

    const resolvedValue = await result.current;
    expect(resolvedValue).toBeUndefined();
    expect(mockSetExchangeRate).not.toHaveBeenCalled();
  });

  it('should set the correct exchange rate when the selected input type is crypto', async () => {
    const mockSetExchangeRate = vi.fn();
    const mockSetExchangeRateLoading = vi.fn();

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

    renderHook(() =>
      useExchangeRate({
        token: ethToken.symbol as PriceQuoteToken,
        selectedInputType: 'crypto',
        setExchangeRate: mockSetExchangeRate,
        setExchangeRateLoading: mockSetExchangeRateLoading,
      }),
    );

    await waitFor(() => {
      expect(mockSetExchangeRate).toHaveBeenCalledWith(1 / 2400);
    });
  });

  it('should set the correct the exchange rate when the selected input type is fiat', async () => {
    const mockSetExchangeRate = vi.fn();
    const mockSetExchangeRateLoading = vi.fn();

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

    renderHook(() =>
      useExchangeRate({
        token: ethToken.symbol as PriceQuoteToken,
        selectedInputType: 'fiat',
        setExchangeRate: mockSetExchangeRate,
        setExchangeRateLoading: mockSetExchangeRateLoading,
      }),
    );

    await waitFor(() => {
      expect(mockSetExchangeRate).toHaveBeenCalledWith(2400);
    });
  });

  it('should log an error and not set the exchange rate when the api call returns an error', async () => {
    const mockSetExchangeRate = vi.fn();
    const mockSetExchangeRateLoading = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error');

    (getPriceQuote as Mock).mockResolvedValue({
      error: 'test error',
    });

    renderHook(() =>
      useExchangeRate({
        token: ethToken.symbol as PriceQuoteToken,
        selectedInputType: 'fiat',
        setExchangeRate: mockSetExchangeRate,
        setExchangeRateLoading: mockSetExchangeRateLoading,
      }),
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching price quote:',
        'test error',
      );
      expect(mockSetExchangeRate).not.toHaveBeenCalled();
    });
  });

  it('should log an error and not set the exchange rate when the api fails', async () => {
    const mockSetExchangeRate = vi.fn();
    const mockSetExchangeRateLoading = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error');

    (getPriceQuote as Mock).mockRejectedValue(new Error('test error'));

    renderHook(() =>
      useExchangeRate({
        token: ethToken.symbol as PriceQuoteToken,
        selectedInputType: 'fiat',
        setExchangeRate: mockSetExchangeRate,
        setExchangeRateLoading: mockSetExchangeRateLoading,
      }),
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Uncaught error fetching price quote:',
        expect.any(Error),
      );
      expect(mockSetExchangeRate).not.toHaveBeenCalled();
    });
  });

  it('should set and unset loading state', async () => {
    const mockSetExchangeRate = vi.fn();
    const mockSetExchangeRateLoading = vi.fn();

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

    renderHook(() =>
      useExchangeRate({
        token: ethToken.symbol as PriceQuoteToken,
        selectedInputType: 'crypto',
        setExchangeRate: mockSetExchangeRate,
        setExchangeRateLoading: mockSetExchangeRateLoading,
      }),
    );

    await waitFor(() => {
      expect(mockSetExchangeRateLoading).toHaveBeenCalledWith(true);
      expect(mockSetExchangeRateLoading).toHaveBeenLastCalledWith(false);
    });
  });
});
