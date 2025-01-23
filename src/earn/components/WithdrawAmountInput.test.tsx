import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useEarnContext } from './EarnProvider';
import { WithdrawAmountInput } from './WithdrawAmountInput';

vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

describe('WithdrawAmountInput', () => {
  it('renders the EarnAmountInput with the correct props', () => {
    const mockSetWithdrawAmount = vi.fn();
    (useEarnContext as Mock).mockReturnValue({
      withdrawAmount: '100',
      setWithdrawAmount: mockSetWithdrawAmount,
    });

    render(<WithdrawAmountInput className="custom-class" />);

    const input = screen.getByPlaceholderText('0.0');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('100');

    const container = input.parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('updates the value when onChange is called', () => {
    const mockSetWithdrawAmount = vi.fn();
    (useEarnContext as Mock).mockReturnValue({
      withdrawAmount: '100',
      setWithdrawAmount: mockSetWithdrawAmount,
    });

    render(<WithdrawAmountInput />);

    const input = screen.getByPlaceholderText('0.0');
    fireEvent.change(input, { target: { value: '200' } });

    expect(mockSetWithdrawAmount).toHaveBeenCalledWith('200');
  });
});
