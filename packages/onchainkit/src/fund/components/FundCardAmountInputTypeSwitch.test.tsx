import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { act } from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { quoteResponseDataMock } from '../mocks';
import type { FundCardProviderProps } from '../types';
import { FundCardAmountInputTypeSwitch } from './FundCardAmountInputTypeSwitch';
import { FundCardProvider, useFundContext } from './FundCardProvider';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(quoteResponseDataMock),
  }),
) as Mock;

vi.mock('../utils/fetchOnrampQuote', () => ({
  fetchOnrampQuote: vi.fn().mockImplementation(() => {
    return Promise.resolve(quoteResponseDataMock);
  }),
}));

const mockContext: FundCardProviderProps = {
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

  describe('loading skeleton', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      (fetchOnrampQuote as Mock).mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(quoteResponseDataMock);
          }, 1000);
        });
      });
    });

    afterEach(() => {
      vi.useRealTimers();

      (fetchOnrampQuote as Mock).mockImplementation(() => {
        return Promise.resolve(quoteResponseDataMock);
      });
    });

    it('renders loading skeleton when exchange rate is loading', async () => {
      await act(async () => {
        render(
          <FundCardProvider {...mockContext} inputType="crypto">
            <FundCardAmountInputTypeSwitch />
            <TestComponent />
          </FundCardProvider>,
        );
      });

      expect(screen.getByTestId('ockSkeleton')).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(1001);
      });

      expect(screen.queryByTestId('ockSkeleton')).not.toBeInTheDocument();
    });
  });

  it('renders fiat to crypto conversion', async () => {
    await act(async () => {
      render(
        <FundCardProvider {...mockContext}>
          <FundCardAmountInputTypeSwitch />
          <TestComponent />
        </FundCardProvider>,
      );
    });

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

  it('applies custom className', async () => {
    await act(async () => {
      render(
        <FundCardProvider {...mockContext}>
          <FundCardAmountInputTypeSwitch className="custom-class" />
          <TestComponent />
        </FundCardProvider>,
      );
    });

    const container = screen.getByTestId('ockAmountTypeSwitch').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('toggles input type from fiat to crypto when clicked', async () => {
    await act(async () => {
      render(
        <FundCardProvider {...mockContext} inputType="fiat">
          <FundCardAmountInputTypeSwitch />
          <TestComponent />
        </FundCardProvider>,
      );
    });
    expect(screen.getByTestId('loading-state').textContent).toBe('not-loading');
    expect(screen.getByTestId('ockAmountLine').textContent).toBe('0 ETH');

    await act(async () => {
      fireEvent.click(screen.getByTestId('ockAmountTypeSwitch'));
    });

    expect(screen.getByTestId('ockAmountLine').textContent).toBe('$0');
  });

  it('toggles input type from crypto to fiat when clicked', async () => {
    await act(async () => {
      render(
        <FundCardProvider {...mockContext} inputType="crypto">
          <FundCardAmountInputTypeSwitch />
          <TestComponent />
        </FundCardProvider>,
      );
    });

    expect(screen.getByTestId('loading-state').textContent).toBe('not-loading');
    expect(screen.getByTestId('ockAmountLine').textContent).toBe('$0');

    await act(async () => {
      fireEvent.click(screen.getByTestId('ockAmountTypeSwitch'));
    });

    expect(screen.getByTestId('ockAmountLine').textContent).toBe('0 ETH');
  });
});
