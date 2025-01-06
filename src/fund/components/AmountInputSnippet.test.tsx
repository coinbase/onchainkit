// import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AmountInputSnippetReact } from '../types';
import { AmountInputSnippet } from './AmountInputSnippet';

describe('AmountInputSnippet', () => {
  const mockSnippet: AmountInputSnippetReact = {
    value: '100',
    type: 'fiat',
    currencySignOrSymbol: '$',
  };

  const mockCryptoSnippet: AmountInputSnippetReact = {
    value: '1',
    type: 'crypto',
    currencySignOrSymbol: 'ETH',
  };

  it('renders fiat snippet correctly', () => {
    render(
      <AmountInputSnippet amountInputSnippet={mockSnippet} onClick={vi.fn()} />,
    );

    expect(screen.getByTestId('ockAmountInputSnippet')).toHaveTextContent(
      '$100',
    );
  });

  it('renders crypto snippet correctly', () => {
    render(
      <AmountInputSnippet
        amountInputSnippet={mockCryptoSnippet}
        onClick={vi.fn()}
      />,
    );

    const button = screen.getByTestId('ockAmountInputSnippet');
    expect(button.textContent).toBe('1ETH');
    expect(button.querySelector('span')).toHaveClass('pl-1');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <AmountInputSnippet
        amountInputSnippet={mockSnippet}
        onClick={handleClick}
      />,
    );

    fireEvent.click(screen.getByTestId('ockAmountInputSnippet'));
    expect(handleClick).toHaveBeenCalledWith(mockSnippet);
  });

  it('shows tooltip with full text on hover', () => {
    render(
      <AmountInputSnippet amountInputSnippet={mockSnippet} onClick={vi.fn()} />,
    );

    const button = screen.getByTestId('ockAmountInputSnippet');
    expect(button).toHaveAttribute('title', '$100');
  });

  it('handles keyboard interaction', () => {
    const handleClick = vi.fn();
    render(
      <AmountInputSnippet
        amountInputSnippet={mockSnippet}
        onClick={handleClick}
      />,
    );

    const button = screen.getByTestId('ockAmountInputSnippet');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledWith(mockSnippet);

    handleClick.mockClear();
    fireEvent.keyDown(button, { key: ' ' });
    expect(handleClick).toHaveBeenCalledWith(mockSnippet);
  });

  it('returns null when value is empty', () => {
    const { container } = render(
      <AmountInputSnippet
        amountInputSnippet={{ ...mockSnippet, value: '' }}
        onClick={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('applies hover state styles', () => {
    render(
      <AmountInputSnippet amountInputSnippet={mockSnippet} onClick={vi.fn()} />,
    );
    const button = screen.getByTestId('ockAmountInputSnippet');
    expect(button).toHaveClass('hover:bg-[var(--ock-bg-default-hover)]');
  });

  it('handles long content with ellipsis', () => {
    const longSnippet = {
      ...mockSnippet,
      value: '100000000',
    };
    render(
      <AmountInputSnippet amountInputSnippet={longSnippet} onClick={vi.fn()} />,
    );
    const button = screen.getByTestId('ockAmountInputSnippet');
    expect(button).toHaveClass('text-ellipsis', 'overflow-hidden', 'w-[60px]');
  });

  it('maintains fixed width with different content lengths', () => {
    const { rerender } = render(
      <AmountInputSnippet amountInputSnippet={mockSnippet} onClick={vi.fn()} />,
    );
    const shortButton = screen.getByTestId('ockAmountInputSnippet');
    const shortWidth = shortButton.className;

    rerender(
      <AmountInputSnippet
        amountInputSnippet={{ ...mockSnippet, value: '100000000' }}
        onClick={vi.fn()}
      />,
    );
    const longButton = screen.getByTestId('ockAmountInputSnippet');
    const longWidth = longButton.className;

    expect(shortWidth).toBe(longWidth);
  });
});
