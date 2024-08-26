import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useBreakpoints } from '../../useBreakpoints';
import { SwapSettingsSlippage } from './SwapSettingsSlippage';

vi.mock('../../useBreakpoints', () => ({
  useBreakpoints: vi.fn(),
}));

const useBreakpointsMock = useBreakpoints as vi.Mock;

describe('SwapSettingsSlippage', () => {
  beforeEach(() => {
    useBreakpointsMock.mockReturnValue('md');
  });

  it('renders null when breakpoint is falsy', () => {
    useBreakpointsMock.mockReturnValue(null);
    const { container } = render(<SwapSettingsSlippage />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the slippage settings for md breakpoint', () => {
    render(<SwapSettingsSlippage />);
    expect(screen.getByText('Max. slippage')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /auto/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /custom/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('switches between Auto and Custom slippage modes', () => {
    render(<SwapSettingsSlippage />);
    const autoButton = screen.getByRole('button', { name: /auto/i });
    const customButton = screen.getByRole('button', { name: /custom/i });
    const input = screen.getByRole('textbox');

    // Initial state
    expect(autoButton).toHaveClass('bg-white text-blue-600');
    expect(customButton).not.toHaveClass('bg-white text-blue-600');
    expect(input).toBeDisabled();

    // Switch to Custom
    fireEvent.click(customButton);
    expect(autoButton).not.toHaveClass('bg-white text-blue-600');
    expect(customButton).toHaveClass('bg-white text-blue-600');
    expect(input).not.toBeDisabled();

    // Switch back to Auto
    fireEvent.click(autoButton);
    expect(autoButton).toHaveClass('bg-white text-blue-600');
    expect(customButton).not.toHaveClass('bg-white text-blue-600');
    expect(input).toBeDisabled();
  });

  it('updates custom slippage value', () => {
    render(<SwapSettingsSlippage />);
    fireEvent.click(screen.getByRole('button', { name: /custom/i }));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '1.5' } });
    expect(input).toHaveValue('1.5');
  });

  it('applies correct classes to the dropdown', () => {
    render(<SwapSettingsSlippage className="custom-class" />);
    const dropdown = screen.getByTestId('ockSwapSettingsDropdown');
    expect(dropdown).toHaveClass('custom-class');
    expect(dropdown).toHaveClass(
      'right-0 z-10 w-[21.75rem] rounded-lg border border-gray-300 bg-gray-50 p-4 shadow-lg dark:border-gray-700 dark:bg-gray-950',
    );
  });

  it('renders correct text content', () => {
    render(<SwapSettingsSlippage />);
    expect(screen.getByText('Max. slippage')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Your swap will revert if the prices change by more than the selected percentage.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('displays initial custom slippage value', () => {
    render(<SwapSettingsSlippage />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('0.5');
  });

  it('disables input when in Auto mode', () => {
    render(<SwapSettingsSlippage />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('enables input when in Custom mode', () => {
    render(<SwapSettingsSlippage />);
    fireEvent.click(screen.getByRole('button', { name: /custom/i }));
    const input = screen.getByRole('textbox');
    expect(input).not.toBeDisabled();
  });
});
