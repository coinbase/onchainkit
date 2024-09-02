import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput';

const mockSetLifeCycleStatus = vi.fn();

vi.mock('./SwapProvider', () => ({
  useSwapContext: () => ({
    setLifeCycleStatus: mockSetLifeCycleStatus,
  }),
}));

vi.mock('../../styles/theme', () => ({
  cn: (...args: unknown[]) =>
    args.filter((arg) => typeof arg === 'string').join(' '),
}));

describe('SwapSettingsSlippageInput', () => {
  beforeEach(() => {
    mockSetLifeCycleStatus.mockClear();
  });

  it('renders with default props', () => {
    render(<SwapSettingsSlippageInput />);
    expect(screen.getByRole('textbox')).toHaveValue('3');
    expect(screen.getByText('%')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Auto' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Custom' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <SwapSettingsSlippageInput className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('uses provided defaultSlippage', () => {
    render(<SwapSettingsSlippageInput defaultSlippage={1.5} />);
    expect(screen.getByRole('textbox')).toHaveValue('1.5');
  });

  it('allows input changes in Custom mode', () => {
    render(<SwapSettingsSlippageInput />);
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '2.5' } });
    expect(screen.getByRole('textbox')).toHaveValue('2.5');
    expect(mockSetLifeCycleStatus).toHaveBeenCalledWith({
      statusName: 'slippageChange',
      statusData: { maxSlippage: 2.5 },
    });
  });

  it('disables input in Auto mode', () => {
    render(<SwapSettingsSlippageInput />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('switches between Auto and Custom modes', () => {
    render(<SwapSettingsSlippageInput defaultSlippage={1.5} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveValue('1.5');
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    expect(input).not.toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Auto' }));
    expect(input).toBeDisabled();
    expect(input).toHaveValue('1.5');
    expect(mockSetLifeCycleStatus).toHaveBeenCalledWith({
      statusName: 'slippageChange',
      statusData: { maxSlippage: 1.5 },
    });
  });

  it('prevents invalid input', () => {
    render(<SwapSettingsSlippageInput />);
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
    expect(screen.getByRole('textbox')).toHaveValue('3');
    expect(mockSetLifeCycleStatus).not.toHaveBeenCalled();
  });

  it('handles decimal input correctly', () => {
    render(<SwapSettingsSlippageInput />);
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '2.75' },
    });
    expect(screen.getByRole('textbox')).toHaveValue('2.75');
    expect(mockSetLifeCycleStatus).toHaveBeenCalledWith({
      statusName: 'slippageChange',
      statusData: { maxSlippage: 2.75 },
    });
  });

  it('applies correct styles in Auto mode', () => {
    render(<SwapSettingsSlippageInput />);
    expect(screen.getByRole('button', { name: 'Auto' })).toHaveClass(
      'bg-white text-blue-600 shadow-sm',
    );
    expect(screen.getByRole('button', { name: 'Custom' })).toHaveClass(
      'text-gray-600 hover:bg-gray-200',
    );
    expect(screen.getByRole('textbox').parentElement).toHaveClass('opacity-50');
  });

  it('applies correct styles in Custom mode', () => {
    render(<SwapSettingsSlippageInput />);
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    expect(screen.getByRole('button', { name: 'Auto' })).toHaveClass(
      'text-gray-600 hover:bg-gray-200',
    );
    expect(screen.getByRole('button', { name: 'Custom' })).toHaveClass(
      'bg-white text-blue-600 shadow-sm',
    );
    expect(screen.getByRole('textbox').parentElement).not.toHaveClass(
      'opacity-50',
    );
  });
});
