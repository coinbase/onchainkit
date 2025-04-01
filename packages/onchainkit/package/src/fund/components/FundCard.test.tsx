import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { openPopup } from '@/internal/utils/openPopup';
import '@testing-library/jest-dom';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { useFundCardFundingUrl } from '../hooks/useFundCardFundingUrl';
import { optionsResponseDataMock, quoteResponseDataMock } from '../mocks';
import type { PresetAmountInputs } from '../types';
import { fetchOnrampOptions } from '../utils/fetchOnrampOptions';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';
import { getFundingPopupSize } from '../utils/getFundingPopupSize';
import { FundCard } from './FundCard';
import { FundCardProvider, useFundContext } from './FundCardProvider';

const mockUpdateInputWidth = vi.fn();
vi.mock('../../internal/hooks/useInputResize', () => ({
  useInputResize: () => mockUpdateInputWidth,
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: () => 'mocked-theme-class',
}));

vi.mock('../hooks/useGetFundingUrl', () => ({
  useGetFundingUrl: vi.fn(),
}));

vi.mock('../hooks/useFundCardFundingUrl', () => ({
  useFundCardFundingUrl: vi.fn(),
}));

vi.mock('@/core/hooks/useOnchainKit', () => ({
  useOnchainKit: () => ({
    apiKey: 'mock-api-key',
    sessionId: 'mock-session-id',
    config: {},
  }),
}));

vi.mock('@/internal/utils/openPopup', () => ({
  openPopup: vi.fn(),
}));

vi.mock('../utils/getFundingPopupSize', () => ({
  getFundingPopupSize: vi.fn(),
}));

vi.mock('../hooks/useFundCardSetupOnrampEventListeners');

vi.mock('../utils/fetchOnrampQuote');
vi.mock('../utils/fetchOnrampOptions');

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
}));

vi.mock('../../wallet/components/ConnectWallet', () => ({
  ConnectWallet: ({ className }: { className?: string }) => (
    <div data-testid="ockConnectWallet_Container" className={className}>
      Connect Wallet
    </div>
  ),
}));

// Test component to access context values
const TestComponent = () => {
  const {
    fundAmountFiat,
    fundAmountCrypto,
    exchangeRate,
    exchangeRateLoading,
    setFundAmountFiat,
    setSelectedInputType,
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
        data-testid="set-crypto-input-type"
        onClick={() => setSelectedInputType('crypto')}
      />
      <button
        type="button"
        data-testid="set-fiat-input-type"
        onClick={() => setSelectedInputType('fiat')}
      />
    </div>
  );
};

const renderComponent = (presetAmountInputs?: PresetAmountInputs) =>
  render(
    <FundCardProvider
      asset="BTC"
      country="US"
      presetAmountInputs={presetAmountInputs}
    >
      <FundCard
        assetSymbol="BTC"
        country="US"
        presetAmountInputs={presetAmountInputs}
      />
      <TestComponent />
    </FundCardProvider>,
  );

describe('FundCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setOnchainKitConfig({ apiKey: 'mock-api-key' });
    mockUpdateInputWidth.mockClear();
    (getFundingPopupSize as Mock).mockImplementation(() => ({
      height: 200,
      width: 100,
    }));
    (useFundCardFundingUrl as Mock).mockReturnValue('mock-funding-url');
    (fetchOnrampQuote as Mock).mockResolvedValue(quoteResponseDataMock);
    (fetchOnrampOptions as Mock).mockResolvedValue(optionsResponseDataMock);
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
    });
  });

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByTestId('ockFundCardHeader')).toBeInTheDocument();
    expect(screen.getByTestId('ockFundButtonTextContent')).toBeInTheDocument();
  });

  it('displays the correct header text', () => {
    renderComponent();
    expect(screen.getByTestId('ockFundCardHeader')).toHaveTextContent(
      'Buy BTC',
    );
  });

  it('displays the correct button text', () => {
    renderComponent();
    expect(screen.getByTestId('ockFundButtonTextContent')).toHaveTextContent(
      'Buy',
    );
  });

  it('handles input changes for fiat amount', () => {
    renderComponent();

    const input = screen.getByTestId('ockTextInput_Input') as HTMLInputElement;

    act(() => {
      fireEvent.change(input, { target: { value: '100' } });
    });

    expect(input.value).toBe('100');
  });

  it('switches input type from fiat to crypto', async () => {
    renderComponent();

    await waitFor(() => {
      const switchButton = screen.getByTestId('ockAmountTypeSwitch');
      fireEvent.click(switchButton);
    });

    expect(screen.getByTestId('ockCurrencySpan')).toHaveTextContent('BTC');
  });

  it('disables the submit button when fund amount is zero and type is fiat', () => {
    renderComponent();
    const setFiatAmountButton = screen.getByTestId('set-fiat-amount');
    fireEvent.click(setFiatAmountButton);

    const button = screen.getByTestId('ockFundButton');
    expect(button).toBeDisabled();
  });

  it('disables the submit button when fund amount is zero and input type is crypto', () => {
    renderComponent();
    const setCryptoInputTypeButton = screen.getByTestId(
      'set-crypto-input-type',
    );
    fireEvent.click(setCryptoInputTypeButton);

    const button = screen.getByTestId('ockFundButton');
    expect(button).toBeDisabled();
  });

  it('enables the submit button when fund amount is greater than zero and type is fiat', async () => {
    renderComponent();
    const setFiatAmountButton = screen.getByTestId('set-fiat-amount');
    fireEvent.click(setFiatAmountButton);

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );
      const input = screen.getByTestId('ockTextInput_Input');
      fireEvent.change(input, { target: { value: '1000' } });

      const button = screen.getByTestId('ockFundButton');
      expect(button).not.toBeDisabled();
    });
  });

  it('enables the submit button when fund amount is greater than zero and type is crypto', async () => {
    renderComponent();
    const setCryptoInputTypeButton = screen.getByTestId(
      'set-crypto-input-type',
    );
    fireEvent.click(setCryptoInputTypeButton);

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );
      const input = screen.getByTestId('ockTextInput_Input');
      fireEvent.change(input, { target: { value: '1000' } });

      const button = screen.getByTestId('ockFundButton');
      expect(button).not.toBeDisabled();
    });
  });

  it('shows loading state when submitting', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );
      const input = screen.getByTestId('ockTextInput_Input');

      fireEvent.change(input, { target: { value: '1000' } });

      const button = screen.getByTestId('ockFundButton');

      expect(screen.queryByTestId('ockSpinner')).not.toBeInTheDocument();
      act(() => {
        fireEvent.click(button);
      });

      expect(screen.getByTestId('ockSpinner')).toBeInTheDocument();
    });
  });

  it('sets submit button state to default on popup close', async () => {
    (openPopup as Mock).mockImplementation(() => ({ closed: true }));

    renderComponent();

    const button = screen.getByTestId('ockFundButton');

    const submitButton = screen.getByTestId('ockFundButton');

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );

      // Simulate entering a valid amount
      const input = screen.getByTestId(
        'ockTextInput_Input',
      ) as HTMLInputElement;

      fireEvent.change(input, { target: { value: '100' } });

      fireEvent.click(button);

      // Assert that the submit button state is set to 'default'
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('renders custom children instead of default children', () => {
    render(
      <FundCard assetSymbol="ETH" country="US">
        <div data-testid="custom-child">Custom Content</div>
      </FundCard>,
    );

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(screen.queryByTestId('ockFundCardHeader')).not.toBeInTheDocument();
  });

  it('handles preset amount input click correctly', async () => {
    const presetAmountInputs: PresetAmountInputs = ['12345', '20', '30'];

    renderComponent(presetAmountInputs);

    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe(
        'not-loading',
      );

      // Click the preset amount input
      const presetAmountInput = screen.getByText('$12,345');

      // Verify the input value was updated
      expect(presetAmountInput).toBeInTheDocument();
    });
  });
});
