import { isApplePaySupported } from '@/buy/utils/isApplePaySupported';
import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { FundEvent } from '@/core/analytics/types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { optionsResponseDataMock, quoteResponseDataMock } from '../mocks';
import { fetchOnrampOptions } from '../utils/fetchOnrampOptions';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';
import { FundCardPaymentMethodDropdown } from './FundCardPaymentMethodDropdown';
import { FundCardProvider, useFundContext } from './FundCardProvider';

vi.mock('../utils/fetchOnrampQuote');
vi.mock('../utils/fetchOnrampOptions');

vi.mock('@/internal/hooks/useOutsideClick', () => ({
  useOutsideClick: (ref: React.RefObject<HTMLElement>, handler: () => void) => {
    document.addEventListener('mousedown', (event) => {
      if (!ref.current || !event.target) {
        return;
      }

      if (!ref.current.contains(event.target as Node)) {
        handler();
      }
    });
  },
}));

vi.mock('@/buy/utils/isApplePaySupported', () => ({
  isApplePaySupported: vi.fn(),
}));

vi.mock('@/core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(),
}));

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
  const mockSendAnalytics = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    setOnchainKitConfig({ apiKey: 'mock-api-key' });
    (isApplePaySupported as Mock).mockResolvedValue(true);
    (fetchOnrampQuote as Mock).mockResolvedValue(quoteResponseDataMock);
    (fetchOnrampOptions as Mock).mockResolvedValue(optionsResponseDataMock);
    (useAnalytics as Mock).mockReturnValue({
      sendAnalytics: mockSendAnalytics,
    });
  });

  const renderWithProvider = ({ amount = '5' }: { amount?: string }) => {
    return render(
      <FundCardProvider asset="ETH" country="US">
        <TestComponent amount={amount} />
      </FundCardProvider>,
    );
  };

  it('disables card payment methods when amount is less than minimum', async () => {
    renderWithProvider({ amount: '1' });
    fireEvent.click(screen.getByTestId('setAmount1'));

    await waitFor(() => {
      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
      );
    });

    const applePayButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__APPLE_PAY',
    );
    expect(applePayButton).toBeDisabled();
    expect(applePayButton).toHaveAttribute(
      'title',
      'Minimum amount of $5 required',
    );

    const debitCardButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__CARD',
    );
    expect(debitCardButton).toBeDisabled();
    expect(debitCardButton).toHaveAttribute(
      'title',
      'Minimum amount of $5 required',
    );

    const coinbaseButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__',
    );
    expect(coinbaseButton).toBeDisabled();
  });

  it('disables card payment methods when amount is more than maximum', async () => {
    renderWithProvider({ amount: '1000000' });
    fireEvent.click(screen.getByTestId('setAmount'));

    await waitFor(() => {
      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
      );
    });

    const applePayButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__APPLE_PAY',
    );
    expect(applePayButton).toBeDisabled();
    expect(applePayButton).toHaveAttribute(
      'title',
      'Maximum amount allowed is $500',
    );

    const debitCardButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__CARD',
    );
    expect(debitCardButton).toBeDisabled();
    expect(debitCardButton).toHaveAttribute(
      'title',
      'Maximum amount allowed is $500',
    );

    const coinbaseButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__',
    );
    expect(coinbaseButton).toBeDisabled();
  });

  it('enables card payment methods when amount meets minimum', async () => {
    renderWithProvider({ amount: '5' });

    fireEvent.click(screen.getByTestId('setAmount'));

    await waitFor(() => {
      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
      );
    });

    const applePayButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__APPLE_PAY',
    );
    const debitCardButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__CARD',
    );
    const coinbaseButton = screen.getByTestId(
      'ockFundCardPaymentMethodSelectRow__',
    );

    expect(applePayButton).not.toBeDisabled();
    expect(debitCardButton).not.toBeDisabled();
    expect(coinbaseButton).not.toBeDisabled();
  });

  it('switches to Coinbase when selected method becomes disabled', async () => {
    renderWithProvider({ amount: '5' });

    fireEvent.click(screen.getByTestId('setAmount'));

    await waitFor(() => {
      fireEvent.click(
        screen.getByTestId(
          'ockFundCardPaymentMethodSelectorToggle__paymentMethodName',
        ),
      );
    });

    fireEvent.click(
      screen.getByTestId('ockFundCardPaymentMethodSelectRow__APPLE_PAY'),
    );

    expect(
      screen.getByTestId(
        'ockFundCardPaymentMethodSelectorToggle__paymentMethodName',
      ),
    ).toHaveTextContent('Apple Pay');

    fireEvent.click(screen.getByTestId('setAmount1'));

    await waitFor(() => {
      expect(
        screen.getByTestId(
          'ockFundCardPaymentMethodSelectorToggle__paymentMethodName',
        ),
      ).toHaveTextContent('Coinbase');
    });
  });

  it('shows disabled reason when payment method is disabled', async () => {
    renderWithProvider({ amount: '1' });

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('setAmount'));
    });

    await waitFor(() => {
      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
      );
    });

    expect(
      screen.queryByText('ACH, debit, cash, crypto balance'),
    ).not.toBeInTheDocument();

    expect(screen.getAllByText('Minimum amount of $5 required')).toHaveLength(
      3,
    );
  });

  it('shows original description when payment method is not disabled', async () => {
    renderWithProvider({ amount: '5' });

    await waitFor(() => {
      fireEvent.click(screen.getByTestId('setAmount'));
    });

    fireEvent.click(
      screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
    );

    expect(
      screen.getByText('ACH, debit, cash, crypto balance'),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText('Up to $500/week. No sign up required.'),
    ).toHaveLength(2);
  });

  it('closes dropdown when clicking outside', async () => {
    renderWithProvider({ amount: '5' });

    fireEvent.click(screen.getByTestId('setAmount'));

    await waitFor(() => {
      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
      );
    });

    expect(
      screen.getByTestId('ockFundCardPaymentMethodDropdown'),
    ).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(
      screen.queryByTestId('ockFundCardPaymentMethodDropdown'),
    ).not.toBeInTheDocument();
  });

  it('closes dropdown when pressing Escape key', async () => {
    renderWithProvider({ amount: '5' });

    fireEvent.click(screen.getByTestId('setAmount'));

    await waitFor(() => {
      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
      );
    });

    expect(
      screen.getByTestId('ockFundCardPaymentMethodDropdown'),
    ).toBeInTheDocument();

    fireEvent.keyUp(
      screen.getByTestId('ockFundCardPaymentMethodDropdownContainer'),
      { key: 'Escape' },
    );

    expect(
      screen.queryByTestId('ockFundCardPaymentMethodDropdown'),
    ).not.toBeInTheDocument();
  });

  it('toggles dropdown visibility when clicking the toggle button', async () => {
    renderWithProvider({ amount: '5' });

    fireEvent.click(screen.getByTestId('setAmount'));

    await waitFor(() => {
      expect(
        screen.queryByTestId('ockFundCardPaymentMethodDropdown'),
      ).not.toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
    );
    expect(
      screen.getByTestId('ockFundCardPaymentMethodDropdown'),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
    );
    expect(
      screen.queryByTestId('ockFundCardPaymentMethodDropdown'),
    ).not.toBeInTheDocument();
  });

  it('ignores non-Escape key presses', async () => {
    renderWithProvider({ amount: '5' });

    fireEvent.click(screen.getByTestId('setAmount'));

    await waitFor(() => {
      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
      );
    });

    expect(
      screen.getByTestId('ockFundCardPaymentMethodDropdown'),
    ).toBeInTheDocument();

    fireEvent.keyUp(
      screen.getByTestId('ockFundCardPaymentMethodDropdownContainer'),
      { key: 'Enter' },
    );

    expect(
      screen.getByTestId('ockFundCardPaymentMethodDropdown'),
    ).toBeInTheDocument();
  });

  it('hides Apple Pay option when not supported', async () => {
    (isApplePaySupported as Mock).mockReturnValue(false);
    renderWithProvider({ amount: '5' });

    fireEvent.click(screen.getByTestId('setAmount'));

    await waitFor(() => {
      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
      );
    });

    expect(
      screen.queryByTestId('ockFundCardPaymentMethodSelectRow__APPLE_PAY'),
    ).not.toBeInTheDocument();

    expect(
      screen.getByTestId('ockFundCardPaymentMethodSelectRow__'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('ockFundCardPaymentMethodSelectRow__CARD'),
    ).toBeInTheDocument();
  });

  it('shows Apple Pay option when supported', async () => {
    (isApplePaySupported as Mock).mockResolvedValue(true);
    renderWithProvider({ amount: '5' });

    await waitFor(() => {
      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
      );
    });

    expect(
      screen.getByTestId('ockFundCardPaymentMethodSelectRow__APPLE_PAY'),
    ).toBeInTheDocument();
  });

  it('shows loading state when there are no payment methods', async () => {
    (fetchOnrampOptions as Mock).mockResolvedValue({
      paymentCurrencies: [],
      purchaseCurrencies: [],
    });
    renderWithProvider({ amount: '5' });

    expect(screen.getByTestId('ockSkeleton')).toBeInTheDocument();
  });

  describe('Analytics', () => {
    it('sends analytics when payment method is selected', async () => {
      renderWithProvider({ amount: '5' });

      fireEvent.click(screen.getByTestId('setAmount'));

      await waitFor(() => {
        fireEvent.click(
          screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
        );
      });

      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectRow__APPLE_PAY'),
      );

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        FundEvent.FundOptionSelected,
        {
          option: 'APPLE_PAY',
        },
      );
    });

    it('does not send analytics when selecting disabled payment method', async () => {
      renderWithProvider({ amount: '1' });

      fireEvent.click(screen.getByTestId('setAmount1'));

      mockSendAnalytics.mockReset();

      await waitFor(() => {
        fireEvent.click(
          screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
        );
      });

      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectRow__APPLE_PAY'),
      );

      expect(mockSendAnalytics).not.toHaveBeenCalled();
    });

    it('sends analytics with correct option when selecting Coinbase', async () => {
      renderWithProvider({ amount: '5' });

      fireEvent.click(screen.getByTestId('setAmount'));

      await waitFor(() => {
        fireEvent.click(
          screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
        );
      });

      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectRow__'),
      );

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        FundEvent.FundOptionSelected,
        {
          option: '',
        },
      );
    });

    it('sends analytics with correct option when selecting debit card', async () => {
      renderWithProvider({ amount: '5' });

      fireEvent.click(screen.getByTestId('setAmount'));

      await waitFor(() => {
        fireEvent.click(
          screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
        );
      });

      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectRow__CARD'),
      );

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        FundEvent.FundOptionSelected,
        {
          option: 'CARD',
        },
      );
    });

    it('sends analytics when automatically switching to Coinbase due to disabled method', async () => {
      renderWithProvider({ amount: '5' });

      fireEvent.click(screen.getByTestId('setAmount'));

      await waitFor(() => {
        fireEvent.click(
          screen.getByTestId('ockFundCardPaymentMethodSelectorToggle'),
        );
      });

      fireEvent.click(
        screen.getByTestId('ockFundCardPaymentMethodSelectRow__APPLE_PAY'),
      );

      mockSendAnalytics.mockReset();

      fireEvent.click(screen.getByTestId('setAmount1'));

      await waitFor(() => {
        expect(mockSendAnalytics).toHaveBeenCalledWith(
          FundEvent.FundOptionSelected,
          {
            option: '',
          },
        );
      });
    });
  });
});
