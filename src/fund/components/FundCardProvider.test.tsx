import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { FundCardProvider, useFundContext } from './FundCardProvider';

const mockResponseData = {
  payment_total: { value: '100.00', currency: 'USD' },
  payment_subtotal: { value: '120.00', currency: 'USD' },
  purchase_amount: { value: '0.1', currency: 'BTC' },
  coinbase_fee: { value: '2.00', currency: 'USD' },
  network_fee: { value: '1.00', currency: 'USD' },
  quote_id: 'quote-id-123',
};

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockResponseData),
  }),
) as Mock;

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
});
