import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { SwapEvent } from '../../core/analytics/types';
import type { Token } from '../../token';
import { DAI_TOKEN, ETH_TOKEN, USDC_TOKEN } from '../mocks';
import type { SwapContextType } from '../types';
import { SwapAmountInput } from './SwapAmountInput';
import { useSwapContext } from './SwapProvider';

vi.mock('../../token', () => ({
  TokenChip: vi.fn(() => <div>TokenChip</div>),
  TokenSelectDropdown: vi.fn(({ setToken, options }) => (
    <div
      data-testid="mock-token-select-dropdown"
      onClick={() => setToken(options[1])}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setToken(options[1]);
        }
      }}
      role="button"
      tabIndex={0}
    >
      TokenSelectDropdown {mockSwappableTokens[1].symbol}
    </div>
  )),
}));

vi.mock('./SwapProvider', () => ({
  useSwapContext: vi.fn(),
}));

const useSwapContextMock = useSwapContext as unknown as ReturnType<
  typeof vi.fn
>;

const mockContextValue = {
  address: '0x123',
  from: {
    amount: '10',
    amountUSD: '1000',
    balance: '0.0002851826238227',
    setAmount: vi.fn(),
    setLoading: vi.fn(),
    setToken: vi.fn(),
    loading: false,
    token: undefined,
  },
  to: {
    amount: '20',
    amountUSD: '2000',
    setAmount: vi.fn(),
    setLoading: vi.fn(),
    setToken: vi.fn(),
    loading: false,
    token: undefined,
  },
  loading: false,
  handleToggle: vi.fn(),
  handleSubmit: vi.fn(),
  handleAmountChange: vi.fn(),
} as unknown as SwapContextType;

vi.mock('../../internal/utils/getRoundedAmount', () => ({
  getRoundedAmount: vi.fn((value) => value.slice(0, 10)),
}));

const mockSwappableTokens: Token[] = [ETH_TOKEN, USDC_TOKEN, DAI_TOKEN];

vi.mock('../../core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({
    sendAnalytics: vi.fn(),
  })),
}));

describe('SwapAmountInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component with the correct label and token', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={ETH_TOKEN} type="from" />);
    expect(screen.getByText('From')).toBeDefined();
  });

  it('should render from token input with max button and balance', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={ETH_TOKEN} type="from" />);
    expect(screen.getByText('Balance: 0.00028518')).toBeDefined();
    expect(screen.getByTestId('ockSwapAmountInput_MaxButton')).toBeDefined();
  });

  it('should not render max button for to token input', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={ETH_TOKEN} type="to" />);
    expect(screen.queryByTestId('ockSwapAmountInput_MaxButton')).toBeNull();
  });

  it('should not render max button if wallet not connected', () => {
    useSwapContextMock.mockReturnValue({ ...mockContextValue, address: '' });
    render(<SwapAmountInput label="From" token={ETH_TOKEN} type="from" />);
    expect(screen.queryByTestId('ockSwapAmountInput_MaxButton')).toBeNull();
  });

  it('should update input value with balance amount on max button click', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={ETH_TOKEN} type="from" />);
    const maxButton = screen.getByTestId('ockSwapAmountInput_MaxButton');
    fireEvent.click(maxButton);
    expect(mockContextValue.from.setAmount).toHaveBeenCalledWith(
      '0.0002851826238227',
    );
  });

  it('should not update input value with balance amount on max button click when balance is undefined', () => {
    const mockContextValueWithNoBalance = {
      ...mockContextValue,
      from: {
        ...mockContextValue.from,
        balance: undefined,
      },
    };
    useSwapContextMock.mockReturnValue(mockContextValueWithNoBalance);
    render(<SwapAmountInput label="From" token={ETH_TOKEN} type="from" />);
    const maxButton = screen.getByTestId('ockSwapAmountInput_MaxButton');
    fireEvent.click(maxButton);
    expect(mockContextValue.from.setAmount).not.toHaveBeenCalled();
  });

  it('should display the correct amount when this type is "from"', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={ETH_TOKEN} type="from" />);
    const input = screen.getByTestId('ockTextInput_Input');
    expect(input).toHaveValue('10');
  });

  it('should display the correct amount when this type is "to"', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="To" token={ETH_TOKEN} type="to" />);
    const input = screen.getByTestId('ockTextInput_Input');
    expect(input).toHaveValue('20');
  });

  it('should call setFromAmount when type is "from" and valid input is entered', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={ETH_TOKEN} type="from" />);
    const input = screen.getByTestId('ockTextInput_Input');
    fireEvent.change(input, { target: { value: '15' } });
    expect(mockContextValue.from.setAmount).toHaveBeenCalledWith('15');
  });

  it('should call setToAmount when type is "to" and valid input is entered', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={ETH_TOKEN} type="to" />);
    const input = screen.getByTestId('ockTextInput_Input');
    fireEvent.change(input, { target: { value: '15' } });
    expect(mockContextValue.to.setAmount).toHaveBeenCalledWith('15');
  });

  it('should not call setAmount when invalid input is entered', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={ETH_TOKEN} type="from" />);
    const input = screen.getByTestId('ockTextInput_Input');
    fireEvent.change(input, { target: { value: 'invalid' } });
    expect(mockContextValue.from.setAmount).not.toHaveBeenCalled();
  });

  it('should call setFromToken when type is "from" and token prop is provided', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={ETH_TOKEN} type="from" />);
    expect(mockContextValue.from.setToken).toHaveBeenCalledWith(ETH_TOKEN);
  });

  it('should call setToToken when type is "to" and token prop is provided', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="To" token={ETH_TOKEN} type="to" />);
    expect(mockContextValue.to.setToken).toHaveBeenCalledWith(ETH_TOKEN);
  });

  it('should call handleAmountChange when type is "from" and delayMs is 0', async () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(
      <SwapAmountInput
        delayMs={0}
        label="From"
        token={ETH_TOKEN}
        type="from"
      />,
    );
    const input = screen.getByTestId('ockTextInput_Input');
    fireEvent.change(input, { target: { value: '15' } });
    expect(mockContextValue.from.setAmount).toHaveBeenCalledWith('15');
    await waitFor(() => {
      expect(mockContextValue.handleAmountChange).toHaveBeenCalled();
    });
  });

  it('should correctly computes sourceTokenOptions excluding destination token', () => {
    const mockContextValueWithTokens = {
      ...mockContextValue,
      to: {
        ...mockContextValue.to,
        token: ETH_TOKEN,
      },
    };
    useSwapContextMock.mockReturnValue(mockContextValueWithTokens);
    render(
      <SwapAmountInput
        label="From"
        token={USDC_TOKEN}
        type="from"
        swappableTokens={mockSwappableTokens}
      />,
    );
    const dropdown = screen.getByText(/TokenSelectDropdown/i);
    expect(dropdown).toBeDefined();
  });

  it('should correctly select a token from the dropdown using mouse and keyboard', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(
      <SwapAmountInput
        label="From"
        type="from"
        swappableTokens={mockSwappableTokens}
      />,
    );
    const tokenSelectDropdown = screen.getByTestId(
      'mock-token-select-dropdown',
    );
    expect(tokenSelectDropdown).toBeDefined();
    expect(tokenSelectDropdown.textContent).toContain('USDC');
    fireEvent.click(tokenSelectDropdown);
    expect(mockContextValue.from.setToken).toHaveBeenCalledWith(USDC_TOKEN);
    expect(mockContextValue.handleAmountChange).toHaveBeenCalledWith(
      'from',
      '10',
      USDC_TOKEN,
    );
    vi.clearAllMocks();
    fireEvent.keyDown(tokenSelectDropdown, { key: 'Enter' });
    expect(mockContextValue.from.setToken).toHaveBeenCalledWith(USDC_TOKEN);
    expect(mockContextValue.handleAmountChange).toHaveBeenCalledWith(
      'from',
      '10',
      USDC_TOKEN,
    );
  });

  it('should hasInsufficientBalance be true when balance is less than amount for type "from"', () => {
    const mockContextValueWithLowBalance = {
      ...mockContextValue,
      from: {
        ...mockContextValue.from,
        balance: '5',
        amount: '10',
      },
    };
    useSwapContextMock.mockReturnValue(mockContextValueWithLowBalance);
    render(<SwapAmountInput label="From" token={ETH_TOKEN} type="from" />);
    const input = screen.getByTestId('ockTextInput_Input');
    expect(input.className).toContain('ock-text-error');
  });

  it('should render a TokenChip component if swappableTokens are not passed as prop', () => {
    useSwapContextMock.mockReturnValue({
      ...mockContextValue,
      to: {
        ...mockContextValue.to,
        token: USDC_TOKEN,
      },
    });
    render(<SwapAmountInput label="To" token={USDC_TOKEN} type="to" />);
    const chips = screen.getAllByText('TokenChip');
    expect(chips.length).toBeGreaterThan(0);
    expect(chips[0]).toBeDefined();
  });

  it('should apply the given className to the button', async () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(
      <SwapAmountInput
        label="From"
        token={ETH_TOKEN}
        type="from"
        className="custom-class"
      />,
    );
    expect(
      screen.getByTestId('ockSwapAmountInput_Container').className,
    ).toContain('custom-class');
  });

  it('should not display anything when amountUSD is null', () => {
    const mockContextValueWithNullUSD = {
      ...mockContextValue,
      from: {
        ...mockContextValue.from,
        amountUSD: null,
      },
    };
    useSwapContextMock.mockReturnValue(mockContextValueWithNullUSD);
    expect(screen.queryByText(/\$/)).toBeNull();
  });

  it('should return null when amount is falsy', () => {
    useSwapContextMock.mockReturnValue({
      ...mockContextValue,
      from: {
        ...mockContextValue.from,
        amountUSD: '',
      },
    });
    render(<SwapAmountInput label="From" token={ETH_TOKEN} type="from" />);
    expect(screen.queryByText(/\$/)).toBeNull();
  });

  describe('analytics', () => {
    it('should send analytics when token is selected', () => {
      const mockSendAnalytics = vi.fn();
      (useAnalytics as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        sendAnalytics: mockSendAnalytics,
      });
      useSwapContextMock.mockReturnValue(mockContextValue);

      render(
        <SwapAmountInput
          label="From"
          type="from"
          swappableTokens={mockSwappableTokens}
        />,
      );

      const tokenSelectDropdown = screen.getByTestId(
        'mock-token-select-dropdown',
      );
      fireEvent.click(tokenSelectDropdown);

      expect(mockSendAnalytics).toHaveBeenCalledWith(SwapEvent.TokenSelected, {
        token: 'USDC',
      });
    });

    it('should send analytics when token is selected via keyboard', () => {
      const mockSendAnalytics = vi.fn();
      (useAnalytics as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        sendAnalytics: mockSendAnalytics,
      });
      useSwapContextMock.mockReturnValue(mockContextValue);

      render(
        <SwapAmountInput
          label="From"
          type="from"
          swappableTokens={mockSwappableTokens}
        />,
      );

      const tokenSelectDropdown = screen.getByTestId(
        'mock-token-select-dropdown',
      );
      fireEvent.keyDown(tokenSelectDropdown, { key: 'Enter' });

      expect(mockSendAnalytics).toHaveBeenCalledWith(SwapEvent.TokenSelected, {
        token: 'USDC',
      });
    });

    it('should not send analytics when token selection is not available', () => {
      const mockSendAnalytics = vi.fn();
      (useAnalytics as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        sendAnalytics: mockSendAnalytics,
      });
      useSwapContextMock.mockReturnValue({
        ...mockContextValue,
        to: {
          ...mockContextValue.to,
          token: USDC_TOKEN,
        },
      });

      render(<SwapAmountInput label="To" token={USDC_TOKEN} type="to" />);

      expect(mockSendAnalytics).not.toHaveBeenCalled();
    });
  });
});
