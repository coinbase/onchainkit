import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput';

vi.mock('../../styles/theme', () => ({
  cn: (...args: string[]) => args.join(' '),
}));

describe('SwapSettingsSlippageInput', () => {
  it('renders with default props', () => {
    render(<SwapSettingsSlippageInput />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('0.5');
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<SwapSettingsSlippageInput className="custom-class" />);
    const container = screen.getByText('%').parentElement;
    expect(container?.className).toContain('custom-class');
  });

  it('uses provided defaultSlippage', () => {
    render(<SwapSettingsSlippageInput defaultSlippage={1.0} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('1');
  });

  it('allows input changes when customSlippageEnabled is true', () => {
    render(<SwapSettingsSlippageInput customSlippageEnabled={true} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2.0' } });
    expect(input.value).toBe('2.0');
  });

  it('disables input when customSlippageEnabled is false', () => {
    render(<SwapSettingsSlippageInput customSlippageEnabled={false} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it('prevents invalid input', () => {
    render(<SwapSettingsSlippageInput customSlippageEnabled={true} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input.value).toBe('0.5'); // Should remain unchanged
  });

  it('applies correct styles', () => {
    render(<SwapSettingsSlippageInput />);
    const container = screen.getByText('%').parentElement;
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(container?.className).toContain(
      'flex items-center justify-between rounded-lg border border-gray-300 w-full bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-950',
    );
    expect(input.className).toContain(
      'flex-grow bg-transparent pl-1 font-normal font-sans text-gray-900 text-sm leading-6 focus:outline-none dark:text-gray-50 w-full',
    );
  });

  it('applies disabled styles when customSlippageEnabled is false', () => {
    render(<SwapSettingsSlippageInput customSlippageEnabled={false} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.className).toContain('cursor-not-allowed opacity-50');
  });
});
