import { renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { quoteResponseDataMock } from '../mocks';
import type { OnrampError } from '../types';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';
import { useOnrampExchangeRate } from './useOnrampExchangeRate';

vi.mock('../utils/fetchOnrampQuote');

describe('useOnrampExchangeRate', () => {
  const mockSetExchangeRate = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (fetchOnrampQuote as Mock).mockResolvedValue(quoteResponseDataMock);
  });

  it('fetches and calculates exchange rate correctly', async () => {
    const { result } = renderHook(() =>
      useOnrampExchangeRate({
        asset: 'ETH',
        currency: 'USD',
        country: 'US',
        setExchangeRate: mockSetExchangeRate,
      }),
    );

    await result.current.fetchExchangeRate();

    // Verify exchange rate calculation
    expect(mockSetExchangeRate).toHaveBeenCalledWith(
      Number(quoteResponseDataMock.purchaseAmount.value) /
        Number(quoteResponseDataMock.paymentSubtotal.value),
    );
  });

  it('handles API errors', async () => {
    const error = new Error('API Error');
    (fetchOnrampQuote as Mock).mockRejectedValue(error);

    const { result } = renderHook(() =>
      useOnrampExchangeRate({
        asset: 'ETH',
        currency: 'USD',
        country: 'US',
        setExchangeRate: mockSetExchangeRate,
        onError: mockOnError,
      }),
    );

    await result.current.fetchExchangeRate();

    // Should call onError with correct error object
    expect(mockOnError).toHaveBeenCalledWith({
      errorType: 'handled_error',
      code: 'EXCHANGE_RATE_ERROR',
      debugMessage: 'API Error',
    } satisfies OnrampError);
  });

  it('includes subdivision in API call when provided', async () => {
    const { result } = renderHook(() =>
      useOnrampExchangeRate({
        asset: 'ETH',
        currency: 'USD',
        country: 'US',
        subdivision: 'CA',
        setExchangeRate: mockSetExchangeRate,
      }),
    );

    await result.current.fetchExchangeRate();

    expect(fetchOnrampQuote).toHaveBeenCalledWith({
      purchaseCurrency: 'ETH',
      paymentCurrency: 'USD',
      paymentAmount: '100',
      paymentMethod: 'CARD',
      country: 'US',
      subdivision: 'CA',
    });
  });

  it('handles unknown errors', async () => {
    const error = { someField: 'unexpected error' };
    (fetchOnrampQuote as Mock).mockRejectedValue(error);

    const { result } = renderHook(() =>
      useOnrampExchangeRate({
        asset: 'ETH',
        currency: 'USD',
        country: 'US',
        setExchangeRate: mockSetExchangeRate,
        onError: mockOnError,
      }),
    );

    await result.current.fetchExchangeRate();

    // Should call onError with correct error object
    expect(mockOnError).toHaveBeenCalledWith({
      errorType: 'unknown_error',
      code: 'EXCHANGE_RATE_ERROR',
      debugMessage: JSON.stringify(error),
    } satisfies OnrampError);
  });
});
