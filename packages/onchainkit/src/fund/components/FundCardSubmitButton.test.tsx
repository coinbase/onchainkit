import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { openPopup } from '@/internal/utils/openPopup';
import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { useFundCardFundingUrl } from '../hooks/useFundCardFundingUrl';
import { quoteResponseDataMock } from '../mocks';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';
import { getFundingPopupSize } from '../utils/getFundingPopupSize';
import { FundCardProvider, useFundContext } from './FundCardProvider';
import { FundCardSubmitButton } from './FundCardSubmitButton';

vi.mock('@/fund/hooks/useGetFundingUrl', () => ({
  useGetFundingUrl: vi.fn(),
}));

vi.mock('@/fund/hooks/useFundCardFundingUrl', () => ({
  useFundCardFundingUrl: vi.fn(),
}));

vi.mock('@/core/hooks/useOnchainKit', () => ({
  useOnchainKit: vi.fn(() => ({
    apiKey: 'mock-api-key',
    sessionId: 'mock-session-id',
    config: {},
  })),
}));

vi.mock('@/fund/utils/setupOnrampEventListeners', () => ({
  setupOnrampEventListeners: vi.fn(),
}));

vi.mock('@/internal/utils/openPopup', () => ({
  openPopup: vi.fn(),
}));

vi.mock('@/fund/hooks/useFundCardFundingUrl', () => ({
  useFundCardFundingUrl: vi.fn(),
}));

vi.mock('@/fund/hooks/useFundCardSetupOnrampEventListeners', () => ({
  useFundCardSetupOnrampEventListeners: vi.fn(),
}));

vi.mock('@/fund/utils/getFundingPopupSize', () => ({
  getFundingPopupSize: vi.fn(),
}));

vi.mock('@/fund/utils/fetchOnrampQuote');

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
}));

vi.mock('@/wallet/components/ConnectWallet', () => ({
  ConnectWallet: ({ className }: { className?: string }) => (
    <div data-testid="ockConnectWallet_Container" className={className}>
      Connect Wallet
    </div>
  ),
}));

// Test component to access context values
const TestHelperComponent = () => {
  const {
    fundAmountFiat,
    fundAmountCrypto,
    exchangeRate,
    exchangeRateLoading,
    setFundAmountFiat,
    setFundAmountCrypto,
  } = useFundContext();

  return (
    <div>
      <span data-testid="test-value-fiat">{fundAmountFiat}</span>
      <span data-testid="test-value-crypto">{fundAmountCrypto}</span>
      <span data-testid="test-value-exchange-rate">{exchangeRate}</span>
      <span data-testid="loading-state">
        {exchangeRateLoading ? 'loading' : 'not-loading'}
      </span>
      <button
        type="button"
        data-testid="set-fiat-amount"
        onClick={() => setFundAmountFiat('100')}
      />
      <button
        type="button"
        data-testid="set-crypto-amount"
        onClick={() => setFundAmountCrypto('1')}
      />
      <button
        type="button"
        data-testid="set-fiat-amount-zero"
        onClick={() => setFundAmountFiat('0')}
      />
      <button
        type="button"
        data-testid="set-crypto-amount-zero"
        onClick={() => setFundAmountCrypto('0')}
      />
    </div>
  );
};

describe('FundCardSubmitButton', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    setOnchainKitConfig({ apiKey: 'mock-api-key' });
    (getFundingPopupSize as Mock).mockImplementation(() => ({
      height: 200,
      width: 100,
    }));
    (useFundCardFundingUrl as Mock).mockReturnValue('mock-funding-url');
    (fetchOnrampQuote as Mock).mockResolvedValue(quoteResponseDataMock);
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
    });
  });

  const renderComponent = async () => {
    return await act(async () =>
      render(
        <FundCardProvider asset="ETH" country="US">
          <TestHelperComponent />
          <FundCardSubmitButton />
        </FundCardProvider>,
      ),
    );
  };

  it('renders custom content when `render` prop is provided', async () => {
    await act(async () =>
      render(
        <FundCardProvider asset="ETH" country="US">
          <FundCardSubmitButton
            render={({ onClick, isDisabled, status }) => (
              <button
                data-testid="custom-render-button"
                onClick={onClick}
                disabled={isDisabled}
              >
                Custom Render - {status}
              </button>
            )}
          />
        </FundCardProvider>,
      ),
    );

    const customButton = screen.getByTestId('custom-render-button');
    expect(customButton).toBeInTheDocument();
    expect(customButton).toHaveTextContent('Custom Render - default');
  });

  it('renders disabled by default when no amount is set', async () => {
    await renderComponent();
    expect(screen.getByTestId('ockFundButton')).toBeDisabled();
  });

  it('displays "Success" text when in success state', async () => {
    const SuccessStateWrapper = () => {
      const { setSubmitButtonState } = useFundContext();

      React.useEffect(() => {
        setSubmitButtonState('success');
      }, [setSubmitButtonState]);

      return <FundCardSubmitButton />;
    };

    render(
      <FundCardProvider asset="ETH" country="US">
        <TestHelperComponent />
        <SuccessStateWrapper />
      </FundCardProvider>,
    );

    const setFiatAmountButton = screen.getByTestId('set-fiat-amount');
    fireEvent.click(setFiatAmountButton);

    await waitFor(() => {
      expect(screen.getByTestId('ockFundButtonTextContent')).toHaveTextContent(
        'Success',
      );
    });
  });

  it('displays "Something went wrong" text when in error state', async () => {
    const ErrorStateWrapper = () => {
      const { setSubmitButtonState } = useFundContext();

      React.useEffect(() => {
        setSubmitButtonState('error');
      }, [setSubmitButtonState]);

      return <FundCardSubmitButton />;
    };

    render(
      <FundCardProvider asset="ETH" country="US">
        <TestHelperComponent />
        <ErrorStateWrapper />
      </FundCardProvider>,
    );

    const setFiatAmountButton = screen.getByTestId('set-fiat-amount');
    fireEvent.click(setFiatAmountButton);

    await waitFor(() => {
      expect(screen.getByTestId('ockFundButtonTextContent')).toHaveTextContent(
        'Something went wrong',
      );
    });
  });

  it('enables when fiat amount is set', async () => {
    await renderComponent();
    const setFiatAmountButton = screen.getByTestId('set-fiat-amount');
    fireEvent.click(setFiatAmountButton);

    const setCryptoAmountButton = screen.getByTestId('set-crypto-amount');
    fireEvent.click(setCryptoAmountButton);

    await waitFor(() => {
      expect(screen.getByTestId('ockFundButton')).not.toBeDisabled();
    });
  });

  it('disables when fiat amount is set to zero', async () => {
    await renderComponent();

    const button = screen.getByTestId('set-fiat-amount-zero');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('ockFundButton')).toBeDisabled();
    });
  });

  it('disables when crypto amount is set to zero', async () => {
    await renderComponent();

    const setCryptoAmountButton = screen.getByTestId('set-crypto-amount-zero');
    fireEvent.click(setCryptoAmountButton);

    await waitFor(() => {
      expect(screen.getByTestId('ockFundButton')).toBeDisabled();
    });
  });

  it('shows loading state when clicked', async () => {
    await renderComponent();

    const setFiatAmountButton = screen.getByTestId('set-fiat-amount');
    fireEvent.click(setFiatAmountButton);

    const setCryptoAmountButton = screen.getByTestId('set-crypto-amount');
    fireEvent.click(setCryptoAmountButton);

    const fundButton = screen.getByTestId('ockFundButton');
    fireEvent.click(fundButton);

    expect(screen.getByTestId('ockSpinner')).toBeInTheDocument();
  });

  it('shows ConnectWallet when no wallet is connected', async () => {
    (useAccount as Mock).mockReturnValue({ address: undefined });
    await renderComponent();

    expect(
      screen.queryByTestId('ockConnectWallet_Container'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('ockFundButton')).not.toBeInTheDocument();
  });

  it('sets submit button state to default on popup close', async () => {
    vi.useFakeTimers();

    (openPopup as Mock).mockImplementation(() => ({ closed: true }));
    await renderComponent();
    const button = screen.getByTestId('ockFundButton');

    // Simulate entering a valid amount
    const setFiatAmountButton = screen.getByTestId('set-fiat-amount');
    await act(async () => {
      fireEvent.click(setFiatAmountButton);
    });

    const setCryptoAmountButton = screen.getByTestId('set-crypto-amount');
    await act(async () => {
      fireEvent.click(setCryptoAmountButton);
    });

    // Click the submit button to trigger loading state
    await act(async () => {
      fireEvent.click(button);
    });

    await act(async () => {
      vi.runOnlyPendingTimers();
    });

    const submitButton = screen.getByTestId('ockFundButton');

    // Assert that the submit button state is set to 'default'
    expect(submitButton).not.toBeDisabled();
  });
});
