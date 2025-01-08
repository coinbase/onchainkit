import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FundCardProviderReact } from '../types';
import { FundCardAmountInputTypeSwitch } from './FundCardAmountInputTypeSwitch';
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

const mockContext: FundCardProviderReact = {
  asset: 'ETH',
  inputType: 'fiat',
  children: <div>Test</div>,
};
describe('FundCardAmountInputTypeSwitch', () => {
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
      inputType,
    } = useFundContext();

    return (
      <div>
        <span data-testid="test-value-fiat">{fundAmountFiat}</span>
        <span data-testid="test-value-crypto">{fundAmountCrypto}</span>
        <span data-testid="test-value-exchange-rate">{exchangeRate}</span>
        <span data-testid="test-value-input-type">{inputType}</span>
        <span data-testid="loading-state">
          {exchangeRateLoading ? 'loading' : 'not-loading'}
        </span>
      </div>
    );
  };

  it('renders fiat to crypto conversion', async () => {
    render(
      <FundCardProvider {...mockContext}>
        <FundCardAmountInputTypeSwitch />
        <TestComponent />
      </FundCardProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );
      expect(screen.getByTestId('ockAmountLine')).toHaveTextContent('0 ETH');
      expect(screen.getByTestId('ockExchangeRateLine')).toHaveTextContent(
        '($1 = 0.00083333 ETH)',
      );
    });
  });

  it('renders crypto to fiat conversion', async () => {
    render(
      <FundCardProvider {...mockContext} inputType="crypto">
        <FundCardAmountInputTypeSwitch />
        <TestComponent />
      </FundCardProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );
      expect(screen.getByTestId('ockAmountLine')).toHaveTextContent('$0');
      expect(screen.getByTestId('ockExchangeRateLine')).toHaveTextContent(
        '($1 = 0.00083333 ETH)',
      );
    });
  });

  it('toggles input type when clicked', async () => {
    render(
      <FundCardProvider {...mockContext} inputType="fiat">
        <FundCardAmountInputTypeSwitch />
        <TestComponent />
      </FundCardProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );
      expect(screen.getByTestId('ockAmountLine').textContent).toBe('0 ETH');
    });

    fireEvent.click(screen.getByTestId('ockAmountTypeSwitch'));

    await waitFor(() => {
      expect(screen.getByTestId('ockAmountLine').textContent).toBe('$0');
    });
  });

  it('renders loading skeleton when exchange rate is loading', () => {
    render(
      <FundCardProvider {...mockContext} inputType="crypto">
        <FundCardAmountInputTypeSwitch />
        <TestComponent />
      </FundCardProvider>,
    );

    expect(screen.getByTestId('ockSkeleton')).toBeInTheDocument();
  });

  it('applies custom className', async () => {
    render(
      <FundCardProvider asset="ETH">
        <FundCardAmountInputTypeSwitch className="custom-class" />
        <TestComponent />
      </FundCardProvider>,
    );

    await waitFor(() => {
      const container = screen.getByTestId('ockAmountTypeSwitch').parentElement;
      expect(container).toHaveClass('custom-class');
    });
  });

  it('toggles input type from fiat to crypto when clicked', async () => {
    render(
      <FundCardProvider {...mockContext} inputType="fiat">
        <FundCardAmountInputTypeSwitch />
        <TestComponent />
      </FundCardProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );
      expect(screen.getByTestId('ockAmountLine').textContent).toBe('0 ETH');
    });

    fireEvent.click(screen.getByTestId('ockAmountTypeSwitch'));

    await waitFor(() => {
      expect(screen.getByTestId('ockAmountLine').textContent).toBe('$0');
    });
  });

  it('toggles input type from crypto to fiat when clicked', async () => {
    render(
      <FundCardProvider {...mockContext} inputType="crypto">
        <FundCardAmountInputTypeSwitch />
        <TestComponent />
      </FundCardProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );
      expect(screen.getByTestId('ockAmountLine').textContent).toBe('$0');
    });

    fireEvent.click(screen.getByTestId('ockAmountTypeSwitch'));

    await waitFor(() => {
      expect(screen.getByTestId('ockAmountLine').textContent).toBe('0 ETH');
    });
  });
});
