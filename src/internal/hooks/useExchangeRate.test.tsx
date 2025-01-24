import { getSwapQuote } from '@/api';
import type { Token } from '@/token';
import { ethToken, usdcToken } from '@/token/constants';
import { renderHook, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useExchangeRate } from './useExchangeRate';

vi.mock('@/api', () => ({
  getSwapQuote: vi.fn(),
}));

describe('useExchangeRate', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return undefined without calling setExchangeRate if a token is not provided', async () => {
    const mockSetExchangeRate = vi.fn();
    const { result } = renderHook(() =>
      useExchangeRate({
        token: undefined as unknown as Token,
        selectedInputType: 'crypto',
        setExchangeRate: mockSetExchangeRate,
        setExchangeRateLoading: vi.fn(),
      }),
    );

    const resolvedValue = await result.current;
    expect(resolvedValue).toBeUndefined();
    expect(mockSetExchangeRate).not.toHaveBeenCalled();
  });

  it('should return 1 if a token is usdc', async () => {
    const mockSetExchangeRate = vi.fn();
    renderHook(() =>
      useExchangeRate({
        token: usdcToken,
        selectedInputType: 'crypto',
        setExchangeRate: mockSetExchangeRate,
        setExchangeRateLoading: vi.fn(),
      }),
    );

    expect(mockSetExchangeRate).toHaveBeenCalledWith(1);
  });

  it('should set the correct exchange rate when the selected input type is crypto', async () => {
    const mockSetExchangeRate = vi.fn();
    const mockSetExchangeRateLoading = vi.fn();

    (getSwapQuote as Mock).mockResolvedValue({
      fromAmountUSD: '200',
      toAmount: '100000000',
      to: {
        decimals: 18,
      },
    });

    renderHook(() =>
      useExchangeRate({
        token: ethToken,
        selectedInputType: 'crypto',
        setExchangeRate: mockSetExchangeRate,
        setExchangeRateLoading: mockSetExchangeRateLoading,
      }),
    );

    await waitFor(() => {
      expect(mockSetExchangeRate).toHaveBeenCalledWith(1 / 200);
    });
  });

  it('should set the correct the exchange rate when the selected input type is fiat', async () => {
    const mockSetExchangeRate = vi.fn();
    const mockSetExchangeRateLoading = vi.fn();

    (getSwapQuote as Mock).mockResolvedValue({
      fromAmountUSD: '200',
      toAmount: '100000000',
      to: {
        decimals: 18,
      },
    });

    renderHook(() =>
      useExchangeRate({
        token: ethToken,
        selectedInputType: 'fiat',
        setExchangeRate: mockSetExchangeRate,
        setExchangeRateLoading: mockSetExchangeRateLoading,
      }),
    );

    await waitFor(() => {
      expect(mockSetExchangeRate).toHaveBeenCalledWith(100000000 / 10 ** 18);
    });
  });

  it('should log an error and not set the exchange rate when the api call returns an error', async () => {
    const mockSetExchangeRate = vi.fn();
    const mockSetExchangeRateLoading = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error');

    (getSwapQuote as Mock).mockResolvedValue({
      error: 'test error',
    });

    renderHook(() =>
      useExchangeRate({
        token: ethToken,
        selectedInputType: 'fiat',
        setExchangeRate: mockSetExchangeRate,
        setExchangeRateLoading: mockSetExchangeRateLoading,
      }),
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching exchange rate:',
        'test error',
      );
      expect(mockSetExchangeRate).not.toHaveBeenCalled();
    });
  });

  it('should log an error and not set the exchange rate when the api fails', async () => {
    const mockSetExchangeRate = vi.fn();
    const mockSetExchangeRateLoading = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error');

    (getSwapQuote as Mock).mockRejectedValue(new Error('test error'));

    renderHook(() =>
      useExchangeRate({
        token: ethToken,
        selectedInputType: 'fiat',
        setExchangeRate: mockSetExchangeRate,
        setExchangeRateLoading: mockSetExchangeRateLoading,
      }),
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Uncaught error fetching exchange rate:',
        expect.any(Error),
      );
      expect(mockSetExchangeRate).not.toHaveBeenCalled();
    });
  });

  it('should set and unset loading state', async () => {
    const mockSetExchangeRate = vi.fn();
    const mockSetExchangeRateLoading = vi.fn();

    (getSwapQuote as Mock).mockResolvedValue({
      fromAmountUSD: '1',
      toAmount: '1',
      to: {
        decimals: 18,
      },
    });

    renderHook(() =>
      useExchangeRate({
        token: ethToken,
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
