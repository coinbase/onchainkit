import '@testing-library/jest-dom';
import { useDebounce } from '@/core-react/internal/hooks/useDebounce';
import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { openPopup } from '@/ui-react/internal/utils/openPopup';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFundCardFundingUrl } from '../hooks/useFundCardFundingUrl';
import type { FundCardPropsReact } from '../types';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';
import { getFundingPopupSize } from '../utils/getFundingPopupSize';
import { FundCard } from './FundCard';
import { FundCardProvider } from './FundCardProvider';

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: () => 'mocked-theme-class',
}));

vi.mock('../hooks/useGetFundingUrl', () => ({
  useGetFundingUrl: vi.fn(),
}));

vi.mock('../../core-react/internal/hooks/useDebounce', () => ({
  useDebounce: vi.fn((callback) => callback),
}));

vi.mock('../hooks/useFundCardFundingUrl', () => ({
  useFundCardFundingUrl: vi.fn(),
}));

vi.mock('../../useOnchainKit');

vi.mock('../utils/setupOnrampEventListeners', () => ({
  setupOnrampEventListeners: vi.fn(),
}));

vi.mock('@/ui-react/internal/utils/openPopup', () => ({
  openPopup: vi.fn(),
}));

vi.mock('../utils/getFundingPopupSize', () => ({
  getFundingPopupSize: vi.fn(),
}));

vi.mock('../hooks/useFundCardSetupOnrampEventListeners');
vi.mock('../utils/fetchOnrampQuote');

const mockResponseData = {
  paymentTotal: { value: '100.00', currency: 'USD' },
  paymentSubtotal: { value: '120.00', currency: 'USD' },
  purchaseAmount: { value: '0.1', currency: 'BTC' },
  coinbaseFee: { value: '2.00', currency: 'USD' },
  networkFee: { value: '1.00', currency: 'USD' },
  quoteId: 'quote-id-123',
};

const defaultProps: FundCardPropsReact = {
  assetSymbol: 'BTC',
  buttonText: 'Buy BTC',
  headerText: 'Fund Your Account',
};

const renderComponent = (props = defaultProps) =>
  render(
    <FundCardProvider asset={props.assetSymbol}>
      <FundCard {...props} />
    </FundCardProvider>,
  );

describe('FundCard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    setOnchainKitConfig({ apiKey: 'mock-api-key' });
    (getFundingPopupSize as Mock).mockImplementation(() => ({
      height: 200,
      width: 100,
    }));
    (useFundCardFundingUrl as Mock).mockReturnValue('mock-funding-url');
    (useDebounce as Mock).mockImplementation((callback) => callback);
    (fetchOnrampQuote as Mock).mockResolvedValue(mockResponseData);
  });

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByTestId('fundCardHeader')).toBeInTheDocument();
    expect(screen.getByTestId('ockFundButtonTextContent')).toBeInTheDocument();
  });

  it('displays the correct header text', () => {
    renderComponent();
    expect(screen.getByTestId('fundCardHeader')).toHaveTextContent(
      'Fund Your Account',
    );
  });

  it('displays the correct button text', () => {
    renderComponent();
    expect(screen.getByTestId('ockFundButtonTextContent')).toHaveTextContent(
      'Buy BTC',
    );
  });

  it('handles input changes for fiat amount', () => {
    renderComponent();

    const input = screen.getByTestId(
      'ockFundCardAmountInput',
    ) as HTMLInputElement;

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

    expect(screen.getByTestId('currencySpan')).toHaveTextContent('BTC');
  });

  it('disables the submit button when fund amount is zero', () => {
    renderComponent();
    const button = screen.getByTestId('ockFundButton');
    expect(button).toBeDisabled();
  });

  it('enables the submit button when fund amount is greater than zero', () => {
    renderComponent();
    const input = screen.getByTestId('ockFundCardAmountInput');
    act(() => {
      fireEvent.change(input, { target: { value: '100' } });
    });
    const button = screen.getByTestId('ockFundButton');
    expect(button).not.toBeDisabled();
  });

  it('shows loading state when submitting', async () => {
    renderComponent();
    const input = screen.getByTestId('ockFundCardAmountInput');
    act(() => {
      fireEvent.change(input, { target: { value: '100' } });
    });
    const button = screen.getByTestId('ockFundButton');

    expect(screen.queryByTestId('ockSpinner')).not.toBeInTheDocument();
    act(() => {
      fireEvent.click(button);
    });

    expect(screen.getByTestId('ockSpinner')).toBeInTheDocument();
  });

  it('renders passed in components', () => {
    const CustomAmountInputComponent = () => (
      <div data-testid="amountInputComponent" />
    );
    const CustomHeaderComponent = () => <div data-testid="headerComponent" />;
    const CustomAmountInputTypeSwitchComponent = () => (
      <div data-testid="amountInputTypeSwitchComponent" />
    );
    const CustomPaymentMethodSelectorDropdownComponent = () => (
      <div data-testid="paymentMethodDropdownComponent" />
    );
    const CustomSubmitButtonComponent = () => (
      <div data-testid="submitButtonComponent" />
    );
    renderComponent({
      ...defaultProps,
      amountInputComponent: CustomAmountInputComponent,
      headerComponent: CustomHeaderComponent,
      amountInputTypeSwithComponent: CustomAmountInputTypeSwitchComponent,
      paymentMethodDropdownComponent:
        CustomPaymentMethodSelectorDropdownComponent,
      submitButtonComponent: CustomSubmitButtonComponent,
    });

    expect(screen.getByTestId('amountInputComponent')).toBeInTheDocument();
    expect(screen.getByTestId('headerComponent')).toBeInTheDocument();
    expect(
      screen.getByTestId('amountInputTypeSwitchComponent'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('paymentMethodDropdownComponent'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('submitButtonComponent')).toBeInTheDocument();
  });

  it('sets submit button state to default on popup close', () => {
    vi.useFakeTimers();

    (openPopup as Mock).mockImplementation(() => ({ closed: true }));
    renderComponent();
    const button = screen.getByTestId('ockFundButton');

    // Simulate entering a valid amount
    const input = screen.getByTestId(
      'ockFundCardAmountInput',
    ) as HTMLInputElement;
    act(() => {
      fireEvent.change(input, { target: { value: '100' } });
    });

    // Click the submit button to trigger loading state
    act(() => {
      fireEvent.click(button);
    });

    vi.runOnlyPendingTimers();

    const submitButton = screen.getByTestId('ockFundButton');

    // Assert that the submit button state is set to 'default'
    expect(submitButton).not.toBeDisabled();
  });
});
