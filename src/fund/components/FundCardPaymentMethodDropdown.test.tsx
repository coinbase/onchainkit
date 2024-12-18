import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PaymentMethodReact } from '../types';
import { FundCardPaymentMethodDropdown } from './FundCardPaymentMethodDropdown';
import { FundCardProvider } from './FundCardProvider';

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

const paymentMethods = [
  {
    icon: 'sampleIcon',
    id: 'ACH_BANK_ACCOUNT',
    name: 'Bank account',
    description: 'Up to $500',
  },
  {
    icon: 'anotherIcon',
    id: 'APPLE_PAY',
    name: 'Apple Pay',
    description: 'Up to $500',
  },
] as PaymentMethodReact[];

const renderComponent = () =>
  render(
    <FundCardProvider asset="BTC">
      <FundCardPaymentMethodDropdown paymentMethods={paymentMethods} />
    </FundCardProvider>,
  );

describe('FundCardPaymentMethodDropdown', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the first payment method by default', () => {
    renderComponent();
    expect(
      screen.getByTestId(
        'ockFundCardPaymentMethodSelectorToggle__paymentMethodName',
      ),
    ).toBeInTheDocument();
  });

  it('toggles the dropdown when the toggle button is clicked', () => {
    renderComponent();
    const toggleButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectorToggle',
    );
    // Initially closed
    expect(
      screen.queryByTestId('ockFundCardPaymentMethodDropdown'),
    ).not.toBeInTheDocument();
    // Click to open
    act(() => {
      toggleButton.click();
    });
    expect(
      screen.getByTestId('ockFundCardPaymentMethodDropdown'),
    ).toBeInTheDocument();
    // Click to close
    act(() => {
      toggleButton.click();
    });
    expect(
      screen.queryByTestId('ockFundCardPaymentMethodDropdown'),
    ).not.toBeInTheDocument();
  });

  it('selects a payment method and updates the selection', () => {
    renderComponent();
    const toggleButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectorToggle',
    );
    act(() => {
      toggleButton.click();
    });
    const applePayOption = screen.getByText('Apple Pay');
    act(() => {
      applePayOption.click();
    });
    expect(screen.getByText('Apple Pay')).toBeInTheDocument();
    expect(
      screen.queryByTestId('ockFundCardPaymentMethodDropdown'),
    ).not.toBeInTheDocument();
  });

  it('closes the dropdown when clicking outside', () => {
    renderComponent();
    const toggleButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectorToggle',
    );

    // Open the dropdown
    act(() => {
      toggleButton.click();
    });

    expect(
      screen.getByTestId('ockFundCardPaymentMethodDropdown'),
    ).toBeInTheDocument();

    // Click outside
    act(() => {
      document.body.click();
    });
    // Assert dropdown is closed
    expect(
      screen.queryByTestId('ockFundCardPaymentMethodDropdown'),
    ).not.toBeInTheDocument();
  });
});
