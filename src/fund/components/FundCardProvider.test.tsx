import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { FundEvent } from '@/core/analytics/types';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { quoteResponseDataMock } from '../mocks';
import { FundCardProvider, useFundContext } from './FundCardProvider';

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(quoteResponseDataMock),
  }),
) as Mock;

let mockSendAnalytics: Mock;

vi.mock('@/core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    sendAnalytics: mockSendAnalytics,
  }),
}));

const TestComponent = () => {
  const context = useFundContext();
  return (
    <div>
      <span data-testid="selected-asset">{context.asset}</span>
      <span data-testid="exchange-rate">{context.exchangeRate}</span>
      <span data-testid="loading-state">
        {context.exchangeRateLoading ? 'loading' : 'not-loading'}
      </span>
    </div>
  );
};

describe('FundCardProvider', () => {
  beforeEach(() => {
    setOnchainKitConfig({ apiKey: '123456789' });
    vi.clearAllMocks();
  });

  describe('analytics', () => {
    beforeEach(() => {
      mockSendAnalytics = vi.fn();
    });

    it('tracks fund amount changes for fiat', async () => {
      const { result } = renderHook(() => useFundContext(), {
        wrapper: ({ children }) => (
          <FundCardProvider asset="ETH" country="US">
            {children}
          </FundCardProvider>
        ),
      });

      act(() => {
        result.current.setFundAmountFiat('100.00');
      });

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        FundEvent.FundAmountChanged,
        {
          amount: 100,
          currency: 'USD',
        },
      );
    });

    it('does not track fund amount changes when amount is invalid', async () => {
      const { result } = renderHook(() => useFundContext(), {
        wrapper: ({ children }) => (
          <FundCardProvider asset="ETH" country="US">
            {children}
          </FundCardProvider>
        ),
      });

      act(() => {
        result.current.setFundAmountFiat('invalid');
      });

      expect(mockSendAnalytics).not.toHaveBeenCalled();
    });

    it('tracks payment method selection', async () => {
      const { result } = renderHook(() => useFundContext(), {
        wrapper: ({ children }) => (
          <FundCardProvider asset="ETH" country="US">
            {children}
          </FundCardProvider>
        ),
      });

      const mockPaymentMethod = {
        id: 'debit_card',
        name: 'Debit Card',
        description: 'Pay with debit card',
        icon: 'card-icon',
        disabled: false,
      };

      act(() => {
        result.current.setSelectedPaymentMethod(mockPaymentMethod);
      });

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        FundEvent.FundOptionSelected,
        {
          option: 'debit_card',
        },
      );
    });

    it('handles fund amount changes with different currencies', async () => {
      const { result } = renderHook(() => useFundContext(), {
        wrapper: ({ children }) => (
          <FundCardProvider asset="ETH" country="GB" currency="GBP">
            {children}
          </FundCardProvider>
        ),
      });

      act(() => {
        result.current.setFundAmountFiat('50.00');
      });

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        FundEvent.FundAmountChanged,
        {
          amount: 50,
          currency: 'GBP',
        },
      );
    });
  });

  it('provides default context values', () => {
    render(
      <FundCardProvider asset="BTC" country="US">
        <TestComponent />
      </FundCardProvider>,
    );
    expect(screen.getByTestId('selected-asset').textContent).toBe('BTC');
  });

  it('fetches and sets exchange rate on mount', async () => {
    act(() => {
      render(
        <FundCardProvider asset="BTC" country="US">
          <TestComponent />
        </FundCardProvider>,
      );
    });

    // Check initial loading state
    expect(screen.getByTestId('loading-state').textContent).toBe('loading');

    // Wait for exchange rate to be set
    await waitFor(() => {
      expect(screen.getByTestId('exchange-rate').textContent).toBe(
        '0.0008333333333333334',
      );
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );
    });

    // Verify fetch was called with correct parameters
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/quote'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"purchase_currency":"BTC"'),
      }),
    );
  });

  it('throws error when useFundContext is used outside of FundCardProvider', () => {
    const TestOutsideProvider = () => {
      useFundContext();
      return <div>Test</div>;
    };

    expect(() => render(<TestOutsideProvider />)).toThrow(
      'useFundContext must be used within a FundCardProvider',
    );
  });

  it('handles exchange rate fetch error', async () => {
    const mockError = new Error('Failed to fetch exchange rate');
    const mockOnError = vi.fn();
    global.fetch = vi.fn(() => Promise.reject(mockError)) as Mock;

    render(
      <FundCardProvider asset="ETH" country="US" onError={mockOnError}>
        <TestComponent />
      </FundCardProvider>,
    );

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith({
        errorType: 'handled_error',
        code: 'EXCHANGE_RATE_ERROR',
        debugMessage: 'Failed to fetch exchange rate',
      });
    });
  });
});
