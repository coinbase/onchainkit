import { renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { optionsResponseDataMock } from '../mocks';
import type { OnrampError } from '../types';
import { fetchOnrampOptions } from '../utils/fetchOnrampOptions';
import { usePaymentMethods } from './usePaymentMethods';

vi.mock('../utils/fetchOnrampOptions');

describe('usePaymentMethods', () => {
  const mockSetPaymentMethods = vi.fn();
  const mockSetIsPaymentMethodsLoading = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (fetchOnrampOptions as Mock).mockResolvedValue(optionsResponseDataMock);
  });

  it('fetches and sets payment methods on mount', async () => {
    renderHook(() =>
      usePaymentMethods({
        country: 'US',
        currency: 'USD',
        setPaymentMethods: mockSetPaymentMethods,
        setIsPaymentMethodsLoading: mockSetIsPaymentMethodsLoading,
      }),
    );

    // Should start loading
    expect(mockSetIsPaymentMethodsLoading).toHaveBeenCalledWith(true);

    // Wait for async operations
    await vi.waitFor(() => {
      expect(mockSetPaymentMethods).toHaveBeenCalled();
      expect(mockSetIsPaymentMethodsLoading).toHaveBeenCalledWith(false);
    });

    // Verify payment methods were set
    const paymentMethods = mockSetPaymentMethods.mock.calls[0][0];
    expect(paymentMethods).toHaveLength(3); // Coinbase, Apple Pay, Card
    expect(paymentMethods[0].name).toBe('Coinbase');
  });

  it('handles API errors', async () => {
    const error = new Error('API Error');
    (fetchOnrampOptions as Mock).mockRejectedValue(error);

    renderHook(() =>
      usePaymentMethods({
        country: 'US',
        currency: 'USD',
        setPaymentMethods: mockSetPaymentMethods,
        setIsPaymentMethodsLoading: mockSetIsPaymentMethodsLoading,
        onError: mockOnError,
      }),
    );

    await vi.waitFor(() => {
      // Should call onError with correct error object
      expect(mockOnError).toHaveBeenCalledWith({
        errorType: 'handled_error',
        code: 'PAYMENT_METHODS_ERROR',
        debugMessage: 'API Error',
      } satisfies OnrampError);

      // Should finish loading
      expect(mockSetIsPaymentMethodsLoading).toHaveBeenCalledWith(false);
    });
  });

  it('handles empty payment methods', async () => {
    // Mock API to return empty payment methods
    (fetchOnrampOptions as Mock).mockResolvedValue({
      paymentCurrencies: [],
      purchaseCurrencies: [],
    });

    renderHook(() =>
      usePaymentMethods({
        country: 'US',
        currency: 'USD',
        setPaymentMethods: mockSetPaymentMethods,
        setIsPaymentMethodsLoading: mockSetIsPaymentMethodsLoading,
        onError: mockOnError,
      }),
    );

    await vi.waitFor(() => {
      // Should call onError with NO_PAYMENT_METHODS code
      expect(mockOnError).toHaveBeenCalledWith({
        errorType: 'handled_error',
        code: 'NO_PAYMENT_METHODS',
        debugMessage:
          'No payment methods found for the selected country and currency. See docs for more information: https://docs.cdp.coinbase.com/onramp/docs/api-configurations',
      } satisfies OnrampError);

      // Should set empty payment methods array
      expect(mockSetPaymentMethods).toHaveBeenCalledWith([]);
    });
  });

  it('includes subdivision in API call when provided', async () => {
    renderHook(() =>
      usePaymentMethods({
        country: 'US',
        subdivision: 'CA',
        currency: 'USD',
        setPaymentMethods: mockSetPaymentMethods,
        setIsPaymentMethodsLoading: mockSetIsPaymentMethodsLoading,
      }),
    );

    expect(fetchOnrampOptions).toHaveBeenCalledWith({
      country: 'US',
      subdivision: 'CA',
    });
  });
});
