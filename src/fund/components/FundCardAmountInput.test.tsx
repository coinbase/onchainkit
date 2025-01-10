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
    expect(screen.getByTestId('ockFundCardAmountInput')).toBeInTheDocument();
    expect(screen.getByTestId('currencySpan')).toHaveTextContent('$');
  });

  it('renders correctly with crypto input type', () => {
    renderWithProvider({ inputType: 'crypto' });
    expect(screen.getByTestId('currencySpan')).toHaveTextContent('ETH');
  });

  it('handles fiat input change', async () => {
    act(() => {
      renderWithProvider({ inputType: 'fiat' });
    });

    await waitFor(() => {
      const input = screen.getByTestId('ockFundCardAmountInput');

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
      const input = screen.getByTestId('ockFundCardAmountInput');

      fireEvent.change(input, { target: { value: '1' } });

      const valueCrypto = screen.getByTestId('test-value-crypto');
      expect(valueCrypto.textContent).toBe('1');
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

  it('applies custom className', () => {
    act(() => {
      render(
        <FundCardProvider asset="ETH" country="US">
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

  it('handles truncation of fiat decimals', async () => {
    act(() => {
      renderWithProvider({ inputType: 'fiat' });
    });

    await waitFor(() => {
      const input = screen.getByTestId('ockFundCardAmountInput');
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

  it('handles zero and empty values in fiat mode', async () => {
    act(() => {
      render(
        <FundCardProvider asset="ETH" country="US">
          <FundCardAmountInput />
          <TestComponent />
        </FundCardProvider>,
      );
    });

    const input = screen.getByTestId('ockFundCardAmountInput');

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
      const input = screen.getByTestId('ockFundCardAmountInput');

      fireEvent.change(input, { target: { value: '400' } });

      const valueFiat = screen.getByTestId('test-value-fiat');
      const valueCrypto = screen.getByTestId('test-value-crypto');
      expect(valueCrypto.textContent).toBe('0.33333333');
      expect(valueFiat.textContent).toBe('400');
    });
  });

  it('updates width based on currency label', async () => {
    const mockResizeObserver = vi.fn();
    global.ResizeObserver = vi.fn().mockImplementation((callback) => {
      // Call the callback to simulate resize
      callback([
        {
          contentRect: { width: 300 },
          target: screen.getByTestId('ockFundCardAmountInputContainer'),
        },
      ]);
      return {
        observe: mockResizeObserver,
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    render(
      <FundCardProvider asset="ETH" country="US">
        <FundCardAmountInput />
      </FundCardProvider>,
    );

    const input = screen.getByTestId('ockFundCardAmountInput');
    const container = screen.getByTestId('ockFundCardAmountInputContainer');

    // Mock getBoundingClientRect for container and currency label
    Object.defineProperty(container, 'getBoundingClientRect', {
      value: () => ({ width: 300 }),
      configurable: true,
    });

    const currencyLabel = screen.getByTestId('currencySpan');
    Object.defineProperty(currencyLabel, 'getBoundingClientRect', {
      value: () => ({ width: 20 }),
      configurable: true,
    });

    //const input = screen.getByTestId('ockFundCardAmountInput');
    // Trigger width update
    act(() => {
      fireEvent.change(input, { target: { value: '10' } });
      window.dispatchEvent(new Event('resize'));
    });

    await waitFor(() => {
      expect(input.style.maxWidth).toBe('280px'); // 300 - 20
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
      const input = screen.getByTestId('ockFundCardAmountInput');
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
