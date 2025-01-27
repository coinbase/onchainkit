import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { DepositAmountInput } from './DepositAmountInput';
import { useEarnContext } from './EarnProvider';

vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

describe('DepositAmountInput', () => {
  it('renders the EarnAmountInput with the correct props', () => {
    const mocksetDepositAmount = vi.fn();
    (useEarnContext as Mock).mockReturnValue({
      depositAmount: '100',
      setDepositAmount: mocksetDepositAmount,
    });

    render(<DepositAmountInput className="custom-class" />);

    const input = screen.getByPlaceholderText('0.0');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('100');

    const container = input.parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('updates the value when onChange is called', () => {
    const mocksetDepositAmount = vi.fn();
    (useEarnContext as Mock).mockReturnValue({
      depositAmount: '100',
      setDepositAmount: mocksetDepositAmount,
    });

    render(<DepositAmountInput />);

    const input = screen.getByPlaceholderText('0.0');
    fireEvent.change(input, { target: { value: '200' } });

    expect(mocksetDepositAmount).toHaveBeenCalledWith('200');
  });
});
