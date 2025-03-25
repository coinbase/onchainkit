import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { quoteResponseDataMock } from '../mocks';
import type { FundCardProviderReact } from '../types';
import { FundCardAmountInputTypeSwitch } from './FundCardAmountInputTypeSwitch';
import { FundCardProvider, useFundContext } from './FundCardProvider';

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(quoteResponseDataMock),
  }),
) as Mock;

const mockContext: FundCardProviderReact = {
  asset: 'ETH',
  country: 'US',
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
      <FundCardProvider asset="ETH" country="US">
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
