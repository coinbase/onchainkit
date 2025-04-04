import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { BuyAmountInput } from './BuyAmountInput';
import { useBuyContext } from './BuyProvider';

vi.mock('./BuyProvider', () => ({
  useBuyContext: vi.fn(),
}));

vi.mock('../../internal/components/TextInput', () => ({
  TextInput: ({
    value,
    setValue,
    onChange,
    disabled,
  }: {
    disabled: boolean;
    value: string;
    setValue: (value: string) => void;
    onChange: (value: string) => void;
  }) => (
    <input
      data-testid="text-input"
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        setValue(e.target.value);
      }}
      disabled={disabled}
    />
  ),
}));

vi.mock('../../token', () => ({
  TokenChip: ({ token }: { token: string }) => (
    <div data-testid="token-chip">{token}</div>
  ),
}));

describe('BuyAmountInput', () => {
  const mockHandleAmountChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useBuyContext as Mock).mockReturnValue({
      to: {
        token: 'ETH',
        amount: 10,
        setAmount: vi.fn(),
        loading: false,
      },
      handleAmountChange: mockHandleAmountChange,
    });
  });

  it('renders null when there is no token', () => {
    (useBuyContext as Mock).mockReturnValue({
      to: { token: null },
      handleAmountChange: mockHandleAmountChange,
    });

    const { container } = render(<BuyAmountInput />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the input and token chip when a token is present', () => {
    render(<BuyAmountInput />);

    expect(screen.getByTestId('text-input')).toBeInTheDocument();
    expect(screen.getByTestId('token-chip')).toBeInTheDocument();
    expect(screen.getByTestId('token-chip')).toHaveTextContent('ETH');
  });

  it('calls handleAmountChange and setAmount on input change', () => {
    const mockSetAmount = vi.fn();
    (useBuyContext as Mock).mockReturnValue({
      to: {
        token: 'ETH',
        amount: 10,
        setAmount: mockSetAmount,
        loading: false,
      },
      handleAmountChange: mockHandleAmountChange,
    });

    render(<BuyAmountInput />);

    const input = screen.getByTestId('text-input');
    fireEvent.change(input, { target: { value: '20' } });

    expect(mockHandleAmountChange).toHaveBeenCalledWith('20');
    expect(mockSetAmount).toHaveBeenCalledWith('20');
  });

  it('disables the input when loading is true', () => {
    (useBuyContext as Mock).mockReturnValue({
      to: {
        token: 'ETH',
        amount: 10,
        setAmount: vi.fn(),
        loading: true,
      },
      handleAmountChange: mockHandleAmountChange,
    });

    render(<BuyAmountInput />);

    const input = screen.getByTestId('text-input');
    expect(input).toBeDisabled();
  });
});
