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
  cn: (...args: string[]) => args.join(' '),
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

  it('applies correct styles', () => {
    render(<SwapSettingsSlippageInput />, { wrapper: TestWrapper });
    const container = screen.getByText('%').closest('div');
    expect(container).toHaveClass(
      'flex items-center justify-between rounded-lg border border-gray-300',
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toHaveClass('flex-grow bg-transparent');
  });

  it('applies disabled styles in Auto mode', () => {
    render(<SwapSettingsSlippageInput />, { wrapper: TestWrapper });
    const inputContainer = screen.getByRole('textbox').closest('div');
    expect(inputContainer).toHaveClass('opacity-50');
  });
});
