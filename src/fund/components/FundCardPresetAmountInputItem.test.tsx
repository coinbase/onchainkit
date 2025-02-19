import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { FundEvent } from '../../core/analytics/types';
import { FundCardPresetAmountInputItem } from './FundCardPresetAmountInputItem';

vi.mock('../../core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(),
}));

describe('FundCardPresetAmountInputItem', () => {
  const mockPresetAmountInput = '100';
  const mockSendAnalytics = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAnalytics as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      sendAnalytics: mockSendAnalytics,
    });
  });

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

  describe('analytics', () => {
    it('sends analytics event when amount is changed via click', () => {
      const handleClick = vi.fn();
      render(
        <FundCardPresetAmountInputItem
          presetAmountInput={mockPresetAmountInput}
          onClick={handleClick}
          currency="USD"
        />,
      );

      fireEvent.click(screen.getByTestId('ockPresetAmountInput'));

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        FundEvent.FundAmountChanged,
        {
          amount: 100,
          currency: 'USD',
        },
      );
    });

    it('sends analytics event when amount is changed via keyboard', () => {
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

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        FundEvent.FundAmountChanged,
        {
          amount: 100,
          currency: 'USD',
        },
      );
    });

    it('does not send analytics event when presetAmountInput is empty', () => {
      render(
        <FundCardPresetAmountInputItem
          presetAmountInput=""
          onClick={vi.fn()}
          currency="USD"
        />,
      );

      expect(mockSendAnalytics).not.toHaveBeenCalled();
    });

    it('sends correct analytics data with different currency', () => {
      const handleClick = vi.fn();
      render(
        <FundCardPresetAmountInputItem
          presetAmountInput="50"
          onClick={handleClick}
          currency="EUR"
        />,
      );

      fireEvent.click(screen.getByTestId('ockPresetAmountInput'));

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        FundEvent.FundAmountChanged,
        {
          amount: 50,
          currency: 'EUR',
        },
      );
    });
  });
});
