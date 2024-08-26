import { fireEvent, render, screen } from '@testing-library/react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput';

const mockSetMaxSlippage = vi.fn();
let mockMaxSlippage = 3;

vi.mock('./SwapProvider', () => ({
  useSwapContext: () => ({
    get maxSlippage() {
      return mockMaxSlippage;
    },
    setMaxSlippage: (value: number) => {
      mockSetMaxSlippage(value);
      mockMaxSlippage = value;
    },
  }),
}));

vi.mock('../../styles/theme', () => ({
  cn: (...args: unknown[]) =>
    args.filter((arg) => typeof arg === 'string').join(' '),
  background: {
    default: 'bg-default',
    inverse: 'bg-inverse',
  },
  border: {
    defaultActive: 'border-default-active',
  },
  color: {
    foreground: 'text-foreground',
    primary: 'text-primary',
    foregroundMuted: 'text-foreground-muted',
  },
  pressable: {
    default: 'pressable-default',
    shadow: 'pressable-shadow',
  },
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

describe('SwapSettingsSlippageInput', () => {
  beforeEach(() => {
    mockMaxSlippage = 3;
    mockSetMaxSlippage.mockClear();
  });

  it('renders with default props', () => {
    render(<SwapSettingsSlippageInput />, { wrapper: TestWrapper });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('3');
    expect(screen.getByText('%')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Auto' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Custom' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <SwapSettingsSlippageInput className="custom-class" />,
      {
        wrapper: TestWrapper,
      },
    );
    const elementWithCustomClass = container.querySelector('.custom-class');
    expect(elementWithCustomClass).not.toBeNull();
  });

  it('uses provided defaultSlippage', () => {
    render(<SwapSettingsSlippageInput defaultSlippage={1.0} />, {
      wrapper: TestWrapper,
    });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('3');
    fireEvent.click(screen.getByRole('button', { name: 'Auto' }));
    expect(input.value).toBe('1');
  });

  it('allows input changes in Custom mode', () => {
    render(<SwapSettingsSlippageInput />, { wrapper: TestWrapper });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    fireEvent.change(input, { target: { value: '2.0' } });
    expect(input.value).toBe('2');
    expect(mockSetMaxSlippage).toHaveBeenCalledWith(2);
  });

  it('disables input in Auto mode', () => {
    render(<SwapSettingsSlippageInput />, { wrapper: TestWrapper });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it('switches between Auto and Custom modes', () => {
    render(<SwapSettingsSlippageInput defaultSlippage={1.5} />, {
      wrapper: TestWrapper,
    });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeDisabled();
    expect(input.value).toBe('3');
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    expect(input).not.toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Auto' }));
    expect(input).toBeDisabled();
    expect(input.value).toBe('1.5');
    expect(mockSetMaxSlippage).toHaveBeenCalledWith(1.5);
  });

  it('prevents invalid input', () => {
    render(<SwapSettingsSlippageInput />, { wrapper: TestWrapper });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.click(screen.getByRole('button', { name: 'Custom' }));
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input.value).toBe('abc');
    expect(mockSetMaxSlippage).not.toHaveBeenCalled();
  });

  it('applies correct styles to container', () => {
    const { container } = render(<SwapSettingsSlippageInput />, {
      wrapper: TestWrapper,
    });
    const divs = container.querySelectorAll('div');
    const targetDiv = divs[1];
    expect(targetDiv).toHaveClass(
      'bg-default border-default-active flex items-center gap-2',
    );
  });

  it('applies correct styles to buttons container', () => {
    const { container } = render(<SwapSettingsSlippageInput />, {
      wrapper: TestWrapper,
    });
    const divs = container.querySelectorAll('div');
    const buttonsContainer = divs[2];
    expect(buttonsContainer).toHaveClass(
      'bg-default border-default-active flex h-9 flex-1 rounded-xl border p-1',
    );
  });

  it('applies correct styles to input container', () => {
    const { container } = render(<SwapSettingsSlippageInput />, {
      wrapper: TestWrapper,
    });
    const divs = container.querySelectorAll('div');
    const inputContainer = divs[3];
    expect(inputContainer).toHaveClass(
      'bg-default border-default-active flex h-9 items-center justify-between rounded-lg border px-2 py-1 w-24 opacity-50',
    );
  });

  it('applies correct styles to mode buttons', () => {
    render(<SwapSettingsSlippageInput />, { wrapper: TestWrapper });
    const autoButton = screen.getByRole('button', { name: 'Auto' });
    const customButton = screen.getByRole('button', { name: 'Custom' });
    expect(autoButton).toHaveClass(
      'pressable-default text-foreground bg-inverse text-primary pressable-shadow',
    );
    expect(customButton).toHaveClass(
      'pressable-default text-foreground text-foreground-muted',
    );
  });

  it('applies correct styles to input container', () => {
    render(<SwapSettingsSlippageInput />, { wrapper: TestWrapper });
    const inputContainer = screen.getByRole('textbox').closest('div');
    expect(inputContainer).toHaveClass(
      'bg-default border-default-active flex h-9 items-center justify-between rounded-lg border px-2 py-1 w-24 opacity-50',
    );
  });

  it('applies correct styles to input', () => {
    render(<SwapSettingsSlippageInput />, { wrapper: TestWrapper });
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toHaveClass(
      'text-foreground flex-grow bg-transparent pl-1 font-normal font-sans text-sm leading-6 focus:outline-none w-full cursor-not-allowed',
    );
  });
});
