import { isApplePaySupported } from '@/buy/utils/isApplePaySupported';
import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_PAYMENT_METHODS } from '../constants';
import { FundCardPaymentMethodDropdown } from './FundCardPaymentMethodDropdown';
import { FundCardProvider, useFundContext } from './FundCardProvider';

// Mock the useOutsideClick hook
vi.mock('@/ui-react/internal/hooks/useOutsideClick', () => ({
  useOutsideClick: (ref: React.RefObject<HTMLElement>, handler: () => void) => {
    // Add click listener to document that calls handler when clicking outside ref
    document.addEventListener('mousedown', (event) => {
      // If ref or event target is null, return
      if (!ref.current || !event.target) {
        return;
      }

      // If click is outside ref element, call handler
      if (!ref.current.contains(event.target as Node)) {
        handler();
      }
    });
  },
}));

// Mock isApplePaySupported
vi.mock('@/buy/utils/isApplePaySupported', () => ({
  isApplePaySupported: vi.fn(),
}));

// Test component to access and modify context
const TestComponent = ({ amount = '5' }: { amount?: string }) => {
  const { setFundAmountFiat } = useFundContext();
  return (
    <>
      <button
        type="button"
        onClick={() => setFundAmountFiat(amount)}
        data-testid="setAmount"
      >
        Set Amount
      </button>
      <button
        type="button"
        onClick={() => setFundAmountFiat('1')}
        data-testid="setAmount1"
      >
        Set amount to 1
      </button>
      <FundCardPaymentMethodDropdown />
    </>
  );
};

describe('FundCardPaymentMethodDropdown', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    setOnchainKitConfig({ apiKey: 'mock-api-key' });
    (isApplePaySupported as Mock).mockResolvedValue(true); // Default to supported
  });

  const renderWithProvider = ({ amount = '5' }: { amount?: string }) => {
    return render(
      <FundCardProvider
        asset="ETH"
        country="US"
        paymentMethods={DEFAULT_PAYMENT_METHODS}
      >
        <TestComponent amount={amount} />
      </FundCardProvider>,
    );
  };

  it('disables card payment methods when amount is less than minimum', () => {
    renderWithProvider({ amount: '1' });

    // Open dropdown
    fireEvent.click(
      screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
    );

    // Check Apple Pay is disabled
    const applePayButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__APPLE_PAY',
    );
    expect(applePayButton).toBeDisabled();
    expect(applePayButton).toHaveAttribute(
      'title',
      'Minimum amount of $5 required',
    );

    // Check Debit Card is disabled
    const debitCardButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__ACH_BANK_ACCOUNT',
    );
    expect(debitCardButton).toBeDisabled();
    expect(debitCardButton).toHaveAttribute(
      'title',
      'Minimum amount of $5 required',
    );

    // Check Coinbase is not disabled
    const coinbaseButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__FIAT_WALLET',
    );
    expect(coinbaseButton).not.toBeDisabled();
  });

  it('enables card payment methods when amount meets minimum', () => {
    renderWithProvider({ amount: '5' });

    // Set amount to 5
    fireEvent.click(screen.getByTestId('setAmount'));

    // Open dropdown
    fireEvent.click(
      screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
    );

    // Check all payment methods are enabled
    const applePayButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__APPLE_PAY',
    );
    const debitCardButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__ACH_BANK_ACCOUNT',
    );
    const coinbaseButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__FIAT_WALLET',
    );

    expect(applePayButton).not.toBeDisabled();
    expect(debitCardButton).not.toBeDisabled();
    expect(coinbaseButton).not.toBeDisabled();
  });

  it('switches to Coinbase when selected method becomes disabled', async () => {
    renderWithProvider({ amount: '5' });

    // Set amount to 5
    fireEvent.click(screen.getByTestId('setAmount'));

    // Open dropdown and select Apple Pay
    fireEvent.click(
      screen.getByTestId(
        'ockFundCardPaymentMethodSelectorToggle__paymentMethodName',
      ),
    );
    fireEvent.click(screen.getByText('Apple Pay'));

    // Verify Apple Pay is selected
    expect(
      screen.getByTestId(
        'ockFundCardPaymentMethodSelectorToggle__paymentMethodName',
      ),
    ).toHaveTextContent('Apple Pay');

    // Change amount to below minimum
    fireEvent.click(screen.getByTestId('setAmount1'));

    // Verify it switched to Coinbase
    await waitFor(() => {
      expect(
        screen.getByTestId(
          'ockFundCardPaymentMethodSelectorToggle__paymentMethodName',
        ),
      ).toHaveTextContent('Coinbase');
    });
  });

  it('shows original description when payment method is not disabled', () => {
    renderWithProvider({ amount: '5' });

    // Set amount to 5
    fireEvent.click(screen.getByTestId('setAmount'));

    // Open dropdown
    fireEvent.click(
      screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
    );

    // Check descriptions are original
    expect(
      screen.getByText('Buy with your Coinbase account'),
    ).toBeInTheDocument();

    expect(screen.getAllByText('Up to $500/week')).toHaveLength(2);
  });

  it('closes dropdown when clicking outside', () => {
    renderWithProvider({ amount: '5' });

    // Open dropdown
    fireEvent.click(
      screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
    );
    expect(
      screen.getByTestId('ockFundCardPaymentMethodDropdown'),
    ).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document.body);

    // Verify dropdown is closed
    expect(
      screen.queryByTestId('ockFundCardPaymentMethodDropdown'),
    ).not.toBeInTheDocument();
  });

  it('closes dropdown when pressing Escape key', () => {
    renderWithProvider({ amount: '5' });

    // Open dropdown
    fireEvent.click(
      screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
    );
    expect(
      screen.getByTestId('ockFundCardPaymentMethodDropdown'),
    ).toBeInTheDocument();

    // Press Escape
    fireEvent.keyUp(
      screen.getByTestId('ockFundCardPaymentMethodDropdownContainer'),
      { key: 'Escape' },
    );

    // Verify dropdown is closed
    expect(
      screen.queryByTestId('ockFundCardPaymentMethodDropdown'),
    ).not.toBeInTheDocument();
  });

  it('toggles dropdown visibility when clicking the toggle button', () => {
    renderWithProvider({ amount: '5' });

    // Initially dropdown should be closed
    expect(
      screen.queryByTestId('ockFundCardPaymentMethodDropdown'),
    ).not.toBeInTheDocument();

    // Open dropdown
    fireEvent.click(
      screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
    );
    expect(
      screen.getByTestId('ockFundCardPaymentMethodDropdown'),
    ).toBeInTheDocument();

    // Close dropdown
    fireEvent.click(
      screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
    );
    expect(
      screen.queryByTestId('ockFundCardPaymentMethodDropdown'),
    ).not.toBeInTheDocument();
  });

  it('ignores non-Escape key presses', () => {
    renderWithProvider({ amount: '5' });

    // Open dropdown
    fireEvent.click(
      screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
    );
    expect(
      screen.getByTestId('ockFundCardPaymentMethodDropdown'),
    ).toBeInTheDocument();

    // Press a different key
    fireEvent.keyUp(
      screen.getByTestId('ockFundCardPaymentMethodDropdownContainer'),
      { key: 'Enter' },
    );

    // Verify dropdown is still open
    expect(
      screen.getByTestId('ockFundCardPaymentMethodDropdown'),
    ).toBeInTheDocument();
  });

  it('hides Apple Pay option when not supported', async () => {
    (isApplePaySupported as Mock).mockReturnValue(false);
    renderWithProvider({ amount: '5' });

    // Wait for Apple Pay check
    await waitFor(() => {
      // Open dropdown
      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
      );
    });

    // Apple Pay should not be in the list
    expect(
      screen.queryByTestId('ockFundCardPaymentMethodSelectRow__APPLE_PAY'),
    ).not.toBeInTheDocument();

    // Other payment methods should still be there
    expect(
      screen.getByTestId('ockFundCardPaymentMethodSelectRow__FIAT_WALLET'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('ockFundCardPaymentMethodSelectRow__ACH_BANK_ACCOUNT'),
    ).toBeInTheDocument();
  });

  it('shows Apple Pay option when supported', async () => {
    (isApplePaySupported as Mock).mockResolvedValue(true);
    renderWithProvider({ amount: '5' });

    // Wait for Apple Pay check
    await waitFor(() => {
      // Open dropdown
      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
      );
    });

    // Apple Pay should be in the list
    expect(
      screen.getByTestId('ockFundCardPaymentMethodSelectRow__APPLE_PAY'),
    ).toBeInTheDocument();
  });
});
