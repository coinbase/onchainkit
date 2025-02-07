import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FALLBACK_DEFAULT_MAX_SLIPPAGE } from '../constants';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput';

const mockSetLifecycleStatus = vi.fn();
const mockSendAnalytics = vi.fn();
let mockLifecycleStatus = {
  statusName: 'init',
  statusData: {
    isMissingRequiredField: false,
    maxSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE,
  },
};

vi.mock('./SwapProvider', () => ({
  useSwapContext: () => ({
    updateLifecycleStatus: mockSetLifecycleStatus,
    lifecycleStatus: mockLifecycleStatus,
    config: { maxSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE },
  }),
}));

vi.mock('../styles/theme', () => ({
  cn: (...args: string[]) => args.join(' '),
}));

vi.mock('@/core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    sendAnalytics: mockSendAnalytics,
  }),
}));

describe('SwapSettingsSlippageInput', () => {
  beforeEach(() => {
    mockSetLifecycleStatus.mockClear();
    mockSendAnalytics.mockClear();
    mockLifecycleStatus = {
      statusName: 'init',
      statusData: {
        isMissingRequiredField: false,
        maxSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE,
      },
    };
  });

  it('renders with default props', () => {
    render(<SwapSettingsSlippageInput />);
    expect(screen.getByRole('textbox')).toHaveValue(
      FALLBACK_DEFAULT_MAX_SLIPPAGE.toString(),
    );
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
    mockLifecycleStatus = {
      statusName: 'error',
      statusData: { isMissingRequiredField: false, maxSlippage: 1.5 },
    };
    render(<SwapSettingsSlippageInput />);
    expect(screen.getByRole('textbox')).toHaveValue('1.5');
  });

  it('allows input changes in Custom mode but maintains default value', () => {
    render(<SwapSettingsSlippageInput />);
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '2.5' } });
    expect(screen.getByRole('textbox')).toHaveValue(
      FALLBACK_DEFAULT_MAX_SLIPPAGE.toString(),
    );
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'slippageChange',
      statusData: {
        maxSlippage: 2.5,
      },
    });
  });

  it('disables input in Auto mode', () => {
    render(<SwapSettingsSlippageInput />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('handles invalid input by maintaining default value', () => {
    render(<SwapSettingsSlippageInput />);
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
    expect(screen.getByRole('textbox')).toHaveValue(
      FALLBACK_DEFAULT_MAX_SLIPPAGE.toString(),
    );
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'slippageChange',
      statusData: {
        maxSlippage: 0,
      },
    });
  });

  it('handles decimal input correctly', () => {
    render(<SwapSettingsSlippageInput />);
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '2.75' },
    });
    expect(screen.getByRole('textbox')).toHaveValue(
      FALLBACK_DEFAULT_MAX_SLIPPAGE.toString(),
    );
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'slippageChange',
      statusData: {
        maxSlippage: 2.75,
      },
    });
  });

  it('applies correct styles in Auto mode', () => {
    render(<SwapSettingsSlippageInput />);
    expect(screen.getByRole('button', { name: 'Auto' })).toHaveClass(
      'cursor-pointer ock-bg-default active:bg-[var(--ock-bg-default-active)] hover:bg-[var(--ock-bg-default-hover)] ock-text-foreground ock-font-family font-semibold text-sm ock-border-radius-inner flex-1 px-3 py-1 transition-colors ock-bg-inverse ock-text-primary ock-shadow-default',
    );
    expect(screen.getByRole('button', { name: 'Custom' })).toHaveClass(
      'cursor-pointer ock-bg-default active:bg-[var(--ock-bg-default-active)] hover:bg-[var(--ock-bg-default-hover)] ock-text-foreground ock-font-family font-semibold text-sm ock-border-radius-inner flex-1 px-3 py-1 transition-colors ock-text-foreground-muted',
    );
    expect(screen.getByRole('textbox').parentElement).toHaveClass('opacity-50');
  });

  it('applies correct styles in Custom mode', () => {
    render(<SwapSettingsSlippageInput />);
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    expect(screen.getByRole('button', { name: 'Auto' })).toHaveClass(
      'cursor-pointer ock-bg-default active:bg-[var(--ock-bg-default-active)] hover:bg-[var(--ock-bg-default-hover)] ock-text-foreground ock-font-family font-semibold text-sm ock-border-radius-inner flex-1 px-3 py-1 transition-colors ock-text-foreground-muted',
    );
    expect(screen.getByRole('button', { name: 'Custom' })).toHaveClass(
      'cursor-pointer ock-bg-default active:bg-[var(--ock-bg-default-active)] hover:bg-[var(--ock-bg-default-hover)] ock-text-foreground ock-font-family font-semibold text-sm ock-border-radius-inner flex-1 px-3 py-1 transition-colors ock-bg-inverse ock-text-primary ock-shadow-default',
    );
    expect(screen.getByRole('textbox').parentElement).not.toHaveClass(
      'opacity-50',
    );
  });

  it('handles empty input by maintaining default value', () => {
    render(<SwapSettingsSlippageInput />);
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });
    expect(screen.getByRole('textbox')).toHaveValue(
      FALLBACK_DEFAULT_MAX_SLIPPAGE.toString(),
    );
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'slippageChange',
      statusData: {
        maxSlippage: 0,
      },
    });
  });

  it('uses lifecycleStatus maxSlippage when available', () => {
    mockLifecycleStatus = {
      statusName: 'updated',
      statusData: {
        isMissingRequiredField: false,
        maxSlippage: 4.5,
      },
    };
    render(<SwapSettingsSlippageInput />);
    expect(screen.getByRole('textbox')).toHaveValue('4.5');
  });

  it('defaults to Custom mode when lifecycleStatus maxSlippage differs from default', () => {
    mockLifecycleStatus = {
      statusName: 'updated',
      statusData: {
        isMissingRequiredField: false,
        maxSlippage: 4.5,
      },
    };
    render(<SwapSettingsSlippageInput />);
    expect(screen.getByRole('button', { name: 'Custom' })).toHaveClass(
      'ock-bg-inverse ock-text-primary ock-shadow-default',
    );
    expect(screen.getByRole('textbox')).not.toBeDisabled();
  });

  it('handles non-numeric input by maintaining default value', () => {
    render(<SwapSettingsSlippageInput />);
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
    expect(screen.getByRole('textbox')).toHaveValue(
      FALLBACK_DEFAULT_MAX_SLIPPAGE.toString(),
    );
    expect(mockSetLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'slippageChange',
      statusData: {
        maxSlippage: 0,
      },
    });
  });

  it('updates slippage when switching from Custom to Auto', () => {
    render(<SwapSettingsSlippageInput />);
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Auto' }));
    expect(screen.getByRole('textbox')).toHaveValue(
      FALLBACK_DEFAULT_MAX_SLIPPAGE.toString(),
    );
    expect(mockSetLifecycleStatus).toHaveBeenLastCalledWith({
      statusName: 'slippageChange',
      statusData: {
        maxSlippage: 5,
      },
    });
  });

  it('maintains default value when switching between Auto and Custom mode', () => {
    render(<SwapSettingsSlippageInput />);
    expect(screen.getByRole('textbox')).toHaveValue(
      FALLBACK_DEFAULT_MAX_SLIPPAGE.toString(),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    expect(screen.getByRole('textbox')).toHaveValue(
      FALLBACK_DEFAULT_MAX_SLIPPAGE.toString(),
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '5' } });
    expect(screen.getByRole('textbox')).toHaveValue(
      FALLBACK_DEFAULT_MAX_SLIPPAGE.toString(),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Auto' }));
    expect(screen.getByRole('textbox')).toHaveValue(
      FALLBACK_DEFAULT_MAX_SLIPPAGE.toString(),
    );
  });

  describe('analytics', () => {
    it('sends analytics when slippage changes in Custom mode', () => {
      render(<SwapSettingsSlippageInput />);
      fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '2.5' },
      });

      expect(mockSendAnalytics).toHaveBeenCalledWith('swapSlippageChanged', {
        previousSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE,
        slippage: 2.5,
      });
    });

    it('sends analytics when switching from Custom to Auto mode with different values', () => {
      mockLifecycleStatus = {
        statusName: 'updated',
        statusData: {
          isMissingRequiredField: false,
          maxSlippage: 2.5,
        },
      };

      render(<SwapSettingsSlippageInput />);
      mockSendAnalytics.mockClear();

      fireEvent.click(screen.getByRole('button', { name: 'Auto' }));

      expect(mockSendAnalytics).toHaveBeenCalledWith('swapSlippageChanged', {
        previousSlippage: 2.5,
        slippage: FALLBACK_DEFAULT_MAX_SLIPPAGE,
      });
    });

    it('sends analytics when handling invalid input', () => {
      render(<SwapSettingsSlippageInput />);
      fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'abc' },
      });

      expect(mockSendAnalytics).toHaveBeenCalledWith('swapSlippageChanged', {
        previousSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE,
        slippage: 0,
      });
    });

    it('sends analytics when handling empty input', () => {
      render(<SwapSettingsSlippageInput />);
      fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
      fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } });

      expect(mockSendAnalytics).toHaveBeenCalledWith('swapSlippageChanged', {
        previousSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE,
        slippage: 0,
      });
    });

    it('sends analytics when handling decimal input', () => {
      render(<SwapSettingsSlippageInput />);
      fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '2.75' },
      });

      expect(mockSendAnalytics).toHaveBeenCalledWith('swapSlippageChanged', {
        previousSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE,
        slippage: 2.75,
      });
    });

    it('does not send analytics when slippage value does not change', () => {
      render(<SwapSettingsSlippageInput />);
      fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: FALLBACK_DEFAULT_MAX_SLIPPAGE.toString() },
      });

      expect(mockSendAnalytics).not.toHaveBeenCalled();
    });
  });
});
