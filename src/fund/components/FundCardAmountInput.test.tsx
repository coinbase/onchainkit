import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FundCardProviderReact } from '../types';
import { FundCardAmountInput } from './FundCardAmountInput';
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

vi.mock('../../core-react/internal/hooks/useDebounce', () => ({
  useDebounce: vi.fn((callback) => callback),
}));

describe('FundCardAmountInput', () => {
  beforeEach(() => {
    setOnchainKitConfig({ apiKey: '123456789' });
    vi.clearAllMocks();
  });

  // Test component to access context values
  const TestComponent = () => {
    const {
      fundAmountFiat,
      fundAmountCrypto,
      exchangeRate,
      exchangeRateLoading,
    } = useFundContext();

    return (
      <div>
        <span data-testid="test-value-fiat">{fundAmountFiat}</span>
        <span data-testid="test-value-crypto">{fundAmountCrypto}</span>
        <span data-testid="test-value-exchange-rate">{exchangeRate}</span>
        <span data-testid="loading-state">
          {exchangeRateLoading ? 'loading' : 'not-loading'}
        </span>
      </div>
    );
  };

  const renderWithProvider = (
    initialProps: Partial<FundCardProviderReact> = {},
  ) => {
    return render(
      <FundCardProvider asset="ETH" {...initialProps}>
        <FundCardAmountInput />
        <TestComponent />
      </FundCardProvider>,
    );
  };

  it('renders correctly with fiat input type', () => {
    renderWithProvider();
    expect(screen.getByTestId('ockFundCardAmountInput')).toBeInTheDocument();
    expect(screen.getByTestId('currencySpan')).toHaveTextContent('$');
  });

  it('renders correctly with crypto input type', () => {
    renderWithProvider({ inputType: 'crypto' });
    expect(screen.getByTestId('currencySpan')).toHaveTextContent('ETH');
  });

  it('handles fiat input change', async () => {
    act(() => {
      renderWithProvider();
    });

    await waitFor(() => {
      const input = screen.getByTestId('ockFundCardAmountInput');

      fireEvent.change(input, { target: { value: '10' } });
      const value = screen.getByTestId('test-value-fiat');
      expect(value.textContent).toBe('10');
    });
  });

  it('formats input value correctly when starting with a dot', async () => {
    act(() => {
      renderWithProvider();
    });

    await waitFor(() => {
      const input = screen.getByTestId('ockFundCardAmountInput');

      fireEvent.change(input, { target: { value: '.5' } });

      const valueFiat = screen.getByTestId('test-value-fiat');
      expect(valueFiat.textContent).toBe('0.5');
    });
  });

  it('handles crypto input change', async () => {
    act(() => {
      renderWithProvider({ inputType: 'crypto' });
    });
    await waitFor(() => {
      const input = screen.getByTestId('ockFundCardAmountInput');

      fireEvent.change(input, { target: { value: '1' } });

      const valueCrypto = screen.getByTestId('test-value-crypto');
      expect(valueCrypto.textContent).toBe('1');
    });
  });

  it('updates input width based on content', async () => {
    act(() => {
      const { rerender } = renderWithProvider();
      rerender(
        <FundCardProvider asset="ETH">
          <FundCardAmountInput />
        </FundCardProvider>,
      );
    });
    await waitFor(() => {
      const hiddenSpan = screen.getByTestId('ockHiddenSpan');
      expect(hiddenSpan).toHaveTextContent('0.');
    });
  });

  it('applies custom className', () => {
    act(() => {
      render(
        <FundCardProvider asset="ETH">
          <FundCardAmountInput className="custom-class" />
        </FundCardProvider>,
      );
    });

    const container = screen.getByTestId('ockFundCardAmountInputContainer');
    expect(container).toHaveClass('custom-class');
  });

  it('handles truncation of crypto decimals', async () => {
    act(() => {
      renderWithProvider({ inputType: 'crypto' });
    });

    await waitFor(() => {
      const input = screen.getByTestId('ockFundCardAmountInput');

      // Test decimal truncation
      fireEvent.change(input, { target: { value: '0.123456789' } });

      const valueCrypto = screen.getByTestId('test-value-crypto');
      expect(valueCrypto.textContent).toBe('0.12345678'); // Truncated to 8 decimals
    });
  });

  it('handles zero and empty values in crypto mode', async () => {
    act(() => {
      render(
        <FundCardProvider asset="ETH" inputType="crypto">
          <FundCardAmountInput />
          <TestComponent />
        </FundCardProvider>,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );

      const input = screen.getByTestId('ockFundCardAmountInput');
      const valueFiat = screen.getByTestId('test-value-fiat');
      const valueCrypto = screen.getByTestId('test-value-crypto');

      // Test zero value
      fireEvent.change(input, { target: { value: '0' } });
      expect(valueCrypto.textContent).toBe('0');
      expect(valueFiat.textContent).toBe('');

      // Test empty value
      fireEvent.change(input, { target: { value: '' } });
      expect(valueCrypto.textContent).toBe('');
      expect(valueFiat.textContent).toBe('');
    });
  });

  it('handles zero and empty values in crypto mode', async () => {
    act(() => {
      render(
        <FundCardProvider asset="ETH" inputType="fiat">
          <FundCardAmountInput />
          <TestComponent />
        </FundCardProvider>,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );

      const input = screen.getByTestId('ockFundCardAmountInput');
      const valueFiat = screen.getByTestId('test-value-fiat');
      const valueCrypto = screen.getByTestId('test-value-crypto');

      // Test zero value
      fireEvent.change(input, { target: { value: '0' } });
      expect(valueCrypto.textContent).toBe('');
      expect(valueFiat.textContent).toBe('0');

      // Test empty value
      fireEvent.change(input, { target: { value: '' } });
      expect(valueCrypto.textContent).toBe('');
      expect(valueFiat.textContent).toBe('');
    });
  });
});
