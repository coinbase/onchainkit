import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { quoteResponseDataMock } from '../mocks';
import type { FundCardProviderReact } from '../types';
import { FundCardAmountInput } from './FundCardAmountInput';
import { FundCardProvider, useFundContext } from './FundCardProvider';

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(quoteResponseDataMock),
  }),
) as Mock;

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('FundCardAmountInput', () => {
  beforeEach(() => {
    global.ResizeObserver = ResizeObserverMock;
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
      <FundCardProvider asset="ETH" country="US" {...initialProps}>
        <FundCardAmountInput />
        <TestComponent />
      </FundCardProvider>,
    );
  };

  it('renders correctly with fiat input type', () => {
    renderWithProvider();
    expect(screen.getByTestId('ockTextInput_Input')).toBeInTheDocument();
    expect(screen.getByTestId('ockCurrencySpan')).toHaveTextContent('USD');
  });

  it('renders correctly with crypto input type', () => {
    renderWithProvider({ inputType: 'crypto' });
    expect(screen.getByTestId('ockCurrencySpan')).toHaveTextContent('ETH');
  });

  it('handles fiat input change', async () => {
    act(() => {
      renderWithProvider({ inputType: 'fiat' });
    });

    await waitFor(() => {
      const input = screen.getByTestId('ockTextInput_Input');

      fireEvent.change(input, { target: { value: '10' } });
      const valueFiat = screen.getByTestId('test-value-fiat');
      const valueCrypto = screen.getByTestId('test-value-crypto');
      expect(valueFiat.textContent).toBe('10');
      expect(valueCrypto.textContent).toBe('');
    });
  });

  it('handles crypto input change', async () => {
    act(() => {
      renderWithProvider({ inputType: 'crypto' });
    });
    await waitFor(() => {
      const input = screen.getByTestId('ockTextInput_Input');

      fireEvent.change(input, { target: { value: '1' } });

      const valueCrypto = screen.getByTestId('test-value-crypto');
      expect(valueCrypto.textContent).toBe('1');
    });
  });

  it('does not allow non-numeric input', async () => {
    act(() => {
      renderWithProvider();
    });

    await waitFor(() => {
      const input = screen.getByTestId('ockTextInput_Input');

      fireEvent.change(input, { target: { value: 'ABC' } });

      const valueFiat = screen.getByTestId('test-value-fiat');
      expect(valueFiat.textContent).toBe('');
    });
  });

  it('applies custom className', () => {
    act(() => {
      render(
        <FundCardProvider asset="ETH" country="US">
          <FundCardAmountInput className="custom-class" />
        </FundCardProvider>,
      );
    });

    const container = screen.getByTestId('ockAmountInputContainer');
    expect(container).toHaveClass('custom-class');
  });

  it('handles truncation of crypto decimals', async () => {
    act(() => {
      renderWithProvider({ inputType: 'crypto' });
    });

    await waitFor(() => {
      const input = screen.getByTestId('ockTextInput_Input');

      // Test decimal truncation
      fireEvent.change(input, { target: { value: '0.123456789' } });

      const valueCrypto = screen.getByTestId('test-value-crypto');
      expect(valueCrypto.textContent).toBe('0.12345678'); // Truncated to 8 decimals
    });
  });

  it('handles truncation of fiat decimals', async () => {
    act(() => {
      renderWithProvider({ inputType: 'fiat' });
    });

    await waitFor(() => {
      const input = screen.getByTestId('ockTextInput_Input');
      fireEvent.change(input, { target: { value: '1000.123456789' } });
      const valueFiat = screen.getByTestId('test-value-fiat');
      expect(valueFiat.textContent).toBe('1000.12');
    });
  });

  it('handles zero and empty values in crypto mode', async () => {
    act(() => {
      render(
        <FundCardProvider asset="ETH" country="US" inputType="crypto">
          <FundCardAmountInput />
          <TestComponent />
        </FundCardProvider>,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );

      const input = screen.getByTestId('ockTextInput_Input');
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

  it('handles zero and empty values in fiat mode', async () => {
    act(() => {
      render(
        <FundCardProvider asset="ETH" country="US">
          <FundCardAmountInput />
          <TestComponent />
        </FundCardProvider>,
      );
    });

    const input = screen.getByTestId('ockTextInput_Input');

    fireEvent.change(input, { target: { value: '0' } });

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );

      const valueFiat = screen.getByTestId('test-value-fiat');
      const valueCrypto = screen.getByTestId('test-value-crypto');

      expect(valueCrypto.textContent).toBe('');
      expect(valueFiat.textContent).toBe('0');
    });
  });

  it('handles non zero values in fiat mode', async () => {
    act(() => {
      render(
        <FundCardProvider asset="ETH" country="US">
          <FundCardAmountInput />
          <TestComponent />
        </FundCardProvider>,
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );
      const input = screen.getByTestId('ockTextInput_Input');

      fireEvent.change(input, { target: { value: '400' } });

      const valueFiat = screen.getByTestId('test-value-fiat');
      const valueCrypto = screen.getByTestId('test-value-crypto');
      expect(valueCrypto.textContent).toBe('0.33333333');
      expect(valueFiat.textContent).toBe('400');
    });
  });

  it('sets empty string for crypto when calculated value is zero', async () => {
    // Mock fetch to return an exchange rate that will make calculatedCryptoValue === '0'
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            payment_total: { value: '100.00', currency: 'USD' },
            payment_subtotal: { value: '0', currency: 'USD' },
            purchase_amount: { value: '0', currency: 'ETH' }, // This will make exchange rate 0
            coinbase_fee: { value: '0', currency: 'USD' },
            network_fee: { value: '0', currency: 'USD' },
            quote_id: 'quote-id-123',
          }),
      }),
    ) as Mock;

    act(() => {
      render(
        <FundCardProvider asset="ETH" country="US">
          <FundCardAmountInput />
          <TestComponent />
        </FundCardProvider>,
      );
    });

    await waitFor(() => {
      const input = screen.getByTestId('ockTextInput_Input');
      const valueFiat = screen.getByTestId('test-value-fiat');
      const valueCrypto = screen.getByTestId('test-value-crypto');

      // Enter a value that will result in calculatedCryptoValue === '0'
      fireEvent.change(input, { target: { value: '1' } });

      expect(valueFiat.textContent).toBe('1');
      expect(valueCrypto.textContent).toBe(''); // Should be empty string when calculatedCryptoValue === '0'

      // Verify the actual calculated value was '0'
      const exchangeRate = screen.getByTestId('test-value-exchange-rate');
      expect(exchangeRate.textContent).toBe('0');
    });
  });
});
