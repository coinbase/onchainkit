import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SwapSettingsSlippageToggle } from './SwapSettingsSlippageToggle';

vi.mock('../../styles/theme', () => ({
  cn: (...args: string[]) => args.join(' '),
}));

describe('SwapSettingsSlippageToggle', () => {
  it('renders with default state', () => {
    const onToggle = vi.fn();
    render(
      <SwapSettingsSlippageToggle
        customSlippageEnabled={false}
        onToggle={onToggle}
      />,
    );
    const autoButton = screen.getByText('Auto');
    const customButton = screen.getByText('Custom');
    expect(autoButton).toBeInTheDocument();
    expect(customButton).toBeInTheDocument();
    expect(autoButton.className).toContain('bg-white text-blue-600');
    expect(customButton.className).toContain('text-gray-600');
  });

  it('applies custom className', () => {
    const onToggle = vi.fn();
    render(
      <SwapSettingsSlippageToggle
        className="custom-class"
        customSlippageEnabled={false}
        onToggle={onToggle}
      />,
    );
    const outerContainer = screen
      .getByText('Auto')
      .closest('div')?.parentElement;
    expect(outerContainer?.className).toContain('custom-class');
  });

  it('toggles between Auto and Custom modes', () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <SwapSettingsSlippageToggle
        customSlippageEnabled={false}
        onToggle={onToggle}
      />,
    );
    const autoButton = screen.getByText('Auto');
    const customButton = screen.getByText('Custom');
    expect(autoButton.className).toContain('bg-white text-blue-600');
    expect(customButton.className).toContain('text-gray-600');

    fireEvent.click(customButton);
    expect(onToggle).toHaveBeenCalledWith(true);

    // Simulate the state change
    rerender(
      <SwapSettingsSlippageToggle
        customSlippageEnabled={true}
        onToggle={onToggle}
      />,
    );
    expect(autoButton.className).toContain('text-gray-600');
    expect(customButton.className).toContain('bg-white text-blue-600');

    fireEvent.click(autoButton);
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it('applies hover styles correctly', () => {
    const onToggle = vi.fn();
    render(
      <SwapSettingsSlippageToggle
        customSlippageEnabled={false}
        onToggle={onToggle}
      />,
    );
    const customButton = screen.getByText('Custom');
    expect(customButton.className).toContain('hover:bg-gray-200');
    expect(customButton.className).toContain('dark:hover:bg-gray-700');
  });

  it('applies dark mode styles', () => {
    const onToggle = vi.fn();
    render(
      <SwapSettingsSlippageToggle
        customSlippageEnabled={false}
        onToggle={onToggle}
      />,
    );
    const container = screen.getByText('Auto').closest('div');
    const buttons = screen.getAllByRole('button');
    expect(container?.className).toContain(
      'dark:border-gray-700 dark:bg-gray-950',
    );
    for (const button of buttons) {
      expect(button.className).toContain('dark:bg-gray-950 dark:text-gray-50');
    }
  });

  it('calls onToggle with correct value when clicked', () => {
    const onToggle = vi.fn();
    render(
      <SwapSettingsSlippageToggle
        customSlippageEnabled={false}
        onToggle={onToggle}
      />,
    );
    const autoButton = screen.getByText('Auto');
    const customButton = screen.getByText('Custom');

    fireEvent.click(customButton);
    expect(onToggle).toHaveBeenCalledWith(true);

    fireEvent.click(autoButton);
    expect(onToggle).toHaveBeenCalledWith(false);
  });
});
