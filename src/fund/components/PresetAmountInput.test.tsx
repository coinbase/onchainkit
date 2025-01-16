// import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PresetAmountInputReact } from '../types';
import { PresetAmountInput } from './PresetAmountInput';

describe('PresetAmountInput', () => {
  const mockPresetAmountInput: PresetAmountInputReact = {
    value: '100',
    type: 'fiat',
  };

  const mockCryptoPresetAmountInput: PresetAmountInputReact = {
    value: '1',
    type: 'crypto',
  };

  it('renders fiat preset amount input correctly', () => {
    render(
      <PresetAmountInput
        presetAmountInput={mockPresetAmountInput}
        onClick={vi.fn()}
        currencyOrAsset="USD"
      />,
    );

    expect(screen.getByTestId('ockPresetAmountInput')).toHaveTextContent(
      '100 USD',
    );
  });

  it('renders crypto preset amount input correctly', () => {
    render(
      <PresetAmountInput
        presetAmountInput={mockCryptoPresetAmountInput}
        onClick={vi.fn()}
        currencyOrAsset="ETH"
      />,
    );

    const button = screen.getByTestId('ockPresetAmountInput');
    expect(button.textContent).toBe('1 ETH');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <PresetAmountInput
        presetAmountInput={mockPresetAmountInput}
        onClick={handleClick}
        currencyOrAsset="USD"
      />,
    );

    fireEvent.click(screen.getByTestId('ockPresetAmountInput'));
    expect(handleClick).toHaveBeenCalledWith(mockPresetAmountInput);
  });

  it('shows tooltip with full text on hover', () => {
    render(
      <PresetAmountInput
        presetAmountInput={mockPresetAmountInput}
        onClick={vi.fn()}
        currencyOrAsset="USD"
      />,
    );

    const button = screen.getByTestId('ockPresetAmountInput');
    expect(button).toHaveAttribute('title', '100 USD');
  });

  it('handles keyboard interaction', () => {
    const handleClick = vi.fn();
    render(
      <PresetAmountInput
        presetAmountInput={mockPresetAmountInput}
        onClick={handleClick}
        currencyOrAsset="USD"
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
      <PresetAmountInput
        presetAmountInput={{ ...mockPresetAmountInput, value: '' }}
        onClick={vi.fn()}
        currencyOrAsset="USD"
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('applies hover state styles', () => {
    render(
      <PresetAmountInput
        presetAmountInput={mockPresetAmountInput}
        onClick={vi.fn()}
        currencyOrAsset="USD"
      />,
    );
    const button = screen.getByTestId('ockPresetAmountInput');
    expect(button).toHaveClass('hover:bg-[var(--ock-bg-default-hover)]');
  });

  it('handles long content with ellipsis', () => {
    const longPresetAmountInput = {
      ...mockPresetAmountInput,
      value: '100000000',
    };
    render(
      <PresetAmountInput
        presetAmountInput={longPresetAmountInput}
        onClick={vi.fn()}
        currencyOrAsset="USD"
      />,
    );
    const button = screen.getByTestId('ockPresetAmountInput');
    expect(button).toHaveClass('text-ellipsis', 'overflow-hidden');
  });

  it('maintains fixed width with different content lengths', () => {
    const { rerender } = render(
      <PresetAmountInput
        presetAmountInput={mockPresetAmountInput}
        onClick={vi.fn()}
        currencyOrAsset="USD"
      />,
    );
    const shortButton = screen.getByTestId('ockPresetAmountInput');
    const shortWidth = shortButton.className;

    rerender(
      <PresetAmountInput
        presetAmountInput={{ ...mockPresetAmountInput, value: '100000000' }}
        onClick={vi.fn()}
        currencyOrAsset="USD"
      />,
    );
    const longButton = screen.getByTestId('ockPresetAmountInput');
    const longWidth = longButton.className;

    expect(shortWidth).toBe(longWidth);
  });
});
