import { getRoundedAmount } from '@/internal/utils/getRoundedAmount';
import { ethToken } from '@/token/constants';
import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useBuyContext } from './BuyProvider';
import { BuyTokenItem } from './BuyTokenItem';

vi.mock('./BuyProvider', () => ({
  useBuyContext: vi.fn(),
}));

vi.mock('@/internal/utils/getRoundedAmount', () => ({
  getRoundedAmount: vi.fn((value) => value),
}));

const ethSwapUnit = {
  token: ethToken,
  amount: '10.5',
  balance: '20',
  amountUSD: '10.5',
  loading: false,
  setAmount: vi.fn(),
  setAmountUSD: vi.fn(),
  setLoading: vi.fn(),
};

describe('BuyTokenItem', () => {
  const mockHandleSubmit = vi.fn();
  const mockSetIsDropdownOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useBuyContext as Mock).mockReturnValue({
      handleSubmit: mockHandleSubmit,
      setIsDropdownOpen: mockSetIsDropdownOpen,
    });
  });

  it('renders null when swapUnit is undefined or has no token', () => {
    const { container } = render(<BuyTokenItem swapUnit={undefined} />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders correctly with valid swapUnit', () => {
    render(<BuyTokenItem swapUnit={ethSwapUnit} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('10.5 ETH')).toBeInTheDocument();
    expect(screen.getByText('Balance: 20')).toBeInTheDocument();
  });

  it('disables button and applies muted styling when balance is insufficient', () => {
    const swapUnit = {
      token: ethToken,
      amount: '10.5',
      balance: '5',
      amountUSD: '10.5',
      loading: false,
      setAmount: vi.fn(),
      setAmountUSD: vi.fn(),
      setLoading: vi.fn(),
    };

    render(<BuyTokenItem swapUnit={swapUnit} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).not.toHaveClass('hover:bg-[var(--ock-bg-inverse)]', {
      exact: false,
    });
    expect(screen.getByText('Insufficient balance: 5')).toHaveClass('text-xs');
  });

  it('triggers handleSubmit and closes dropdown on click', () => {
    render(<BuyTokenItem swapUnit={ethSwapUnit} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSetIsDropdownOpen).toHaveBeenCalledWith(false);
    expect(mockHandleSubmit).toHaveBeenCalledWith(ethSwapUnit);
  });

  it('formats amount and balance using getRoundedAmount', () => {
    const swapUnit = {
      token: ethToken,
      amount: '10.5678',
      balance: '20.1234',
      amountUSD: '10.5',
      loading: false,
      setAmount: vi.fn(),
      setAmountUSD: vi.fn(),
      setLoading: vi.fn(),
    };

    (getRoundedAmount as Mock).mockImplementation((value) => value.slice(0, 4));

    render(<BuyTokenItem swapUnit={swapUnit} />);

    expect(getRoundedAmount).toHaveBeenCalledWith('10.5678', 10);
    expect(getRoundedAmount).toHaveBeenCalledWith('20.1234', 3);
    expect(screen.getByText('10.5 ETH')).toBeInTheDocument();
    expect(screen.getByText('Balance: 20.1')).toBeInTheDocument();
  });
});
