import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PaymentMethodReact } from '../types';
import { FundCardPaymentMethodDropdown } from './FundCardPaymentMethodDropdown';
import { FundCardProvider } from './FundCardProvider';

const paymentMethods: PaymentMethodReact[] = [
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
];

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

    act(() => {
      toggleButton.click();
    });

    expect(
      screen.getByTestId('ockFundCardPaymentMethodDropdown'),
    ).toBeInTheDocument();

    act(() => {
      document.body.click();
    });

    expect(
      screen.queryByTestId('ockFundCardPaymentMethodDropdown'),
    ).not.toBeInTheDocument();
  });

  it('closes the dropdown when Escape key is pressed', () => {
    renderComponent();
    const toggleButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectorToggle',
    );

    act(() => {
      toggleButton.click();
    });
    expect(
      screen.getByTestId('ockFundCardPaymentMethodDropdown'),
    ).toBeInTheDocument();

    act(() => {
      fireEvent.keyUp(screen.getByTestId('ockFundCardPaymentMethodDropdown'), {
        key: 'Escape',
      });
    });

    expect(
      screen.queryByTestId('ockFundCardPaymentMethodDropdown'),
    ).not.toBeInTheDocument();
  });
});
