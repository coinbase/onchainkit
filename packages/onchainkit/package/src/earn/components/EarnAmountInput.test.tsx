import { isValidAmount } from '@/internal/utils/isValidAmount';
import { formatAmount } from '@/swap/utils/formatAmount';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EarnAmountInput } from './EarnAmountInput';

vi.mock('@/swap/utils/formatAmount', () => ({
  formatAmount: vi.fn((value) => value),
}));

vi.mock('@/internal/utils/isValidAmount', () => ({
  isValidAmount: vi.fn((value) => /^\d*(\.\d{0,2})?$/.test(value)),
}));

describe('EarnAmountInput Component', () => {
  it('renders the component correctly', () => {
    render(<EarnAmountInput value="0" onChange={() => {}} />);

    const input = screen.getByPlaceholderText('0.0');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('0');
  });

  it('formats the value using formatAmount', () => {
    render(<EarnAmountInput value="1234.56" onChange={() => {}} />);

    const input = screen.getByPlaceholderText('0.0');
    expect(formatAmount).toHaveBeenCalledWith('1234.56');
    expect(input).toHaveValue('1234.56');
  });

  it('calls onChange when the value changes', () => {
    const handleChange = vi.fn();
    render(<EarnAmountInput value="0" onChange={handleChange} />);

    const input = screen.getByPlaceholderText('0.0');
    fireEvent.change(input, { target: { value: '50' } });

    expect(handleChange).toHaveBeenCalledWith('50');
  });

  it('validates input using inputValidator', () => {
    render(<EarnAmountInput value="0" onChange={() => {}} />);

    const input = screen.getByPlaceholderText('0.0');
    fireEvent.change(input, { target: { value: 'invalid' } });

    expect(isValidAmount).toHaveBeenCalledWith('invalid');
    expect(isValidAmount('invalid')).toBe(false);
  });

  it('disables the input when the disabled prop is true', () => {
    render(<EarnAmountInput value="0" onChange={() => {}} disabled={true} />);

    const input = screen.getByPlaceholderText('0.0');
    expect(input).toBeDisabled();
  });

  it('applies custom className', () => {
    render(
      <EarnAmountInput
        value="0"
        onChange={() => {}}
        className="custom-class"
      />,
    );

    const container = screen.getByPlaceholderText('0.0').parentElement;
    expect(container).toHaveClass('custom-class');
  });
});
