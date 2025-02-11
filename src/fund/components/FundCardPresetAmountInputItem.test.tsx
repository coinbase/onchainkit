import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FundCardPresetAmountInputItem } from './FundCardPresetAmountInputItem';

describe('FundCardPresetAmountInputItem', () => {
  const mockPresetAmountInput = '100';

  it('renders fiat preset amount input correctly', () => {
    render(
      <FundCardPresetAmountInputItem
        presetAmountInput={mockPresetAmountInput}
        onClick={vi.fn()}
        currency="USD"
      />,
    );

    expect(screen.getByTestId('ockPresetAmountInput')).toHaveTextContent(
      '$100',
    );
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <FundCardPresetAmountInputItem
        presetAmountInput={mockPresetAmountInput}
        onClick={handleClick}
        currency="USD"
      />,
    );

    fireEvent.click(screen.getByTestId('ockPresetAmountInput'));
    expect(handleClick).toHaveBeenCalledWith(mockPresetAmountInput);
  });

  it('shows tooltip with full text on hover', () => {
    render(
      <FundCardPresetAmountInputItem
        presetAmountInput={mockPresetAmountInput}
        onClick={vi.fn()}
        currency="USD"
      />,
    );

    const button = screen.getByTestId('ockPresetAmountInput');
    expect(button).toHaveAttribute('title', '$100');
  });

  it('handles keyboard interaction', () => {
    const handleClick = vi.fn();
    render(
      <FundCardPresetAmountInputItem
        presetAmountInput={mockPresetAmountInput}
        onClick={handleClick}
        currency="USD"
      />,
    );

    const button = screen.getByTestId('ockPresetAmountInput');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledWith(mockPresetAmountInput);

    handleClick.mockClear();
    fireEvent.keyDown(button, { key: ' ' });
    expect(handleClick).toHaveBeenCalledWith(mockPresetAmountInput);
  });

  it('returns null when value is empty', () => {
    const { container } = render(
      <FundCardPresetAmountInputItem
        presetAmountInput={''}
        onClick={vi.fn()}
        currency="USD"
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('applies hover state styles', () => {
    render(
      <FundCardPresetAmountInputItem
        presetAmountInput={mockPresetAmountInput}
        onClick={vi.fn()}
        currency="USD"
      />,
    );
    const button = screen.getByTestId('ockPresetAmountInput');
    expect(button).toHaveClass('hover:bg-[var(--ock-bg-default-hover)]');
  });

  it('handles long content with ellipsis', () => {
    const longPresetAmountInput = '100000000';
    render(
      <FundCardPresetAmountInputItem
        presetAmountInput={longPresetAmountInput}
        onClick={vi.fn()}
        currency="USD"
      />,
    );
    const button = screen.getByTestId('ockPresetAmountInput');
    expect(button).toHaveClass('text-ellipsis', 'overflow-hidden');
  });

  it('maintains fixed width with different content lengths', () => {
    const { rerender } = render(
      <FundCardPresetAmountInputItem
        presetAmountInput={mockPresetAmountInput}
        onClick={vi.fn()}
        currency="USD"
      />,
    );
    const shortButton = screen.getByTestId('ockPresetAmountInput');
    const shortWidth = shortButton.className;

    rerender(
      <FundCardPresetAmountInputItem
        presetAmountInput="100000000"
        onClick={vi.fn()}
        currency="USD"
      />,
    );
    const longButton = screen.getByTestId('ockPresetAmountInput');
    const longWidth = longButton.className;

    expect(shortWidth).toBe(longWidth);
  });
});
