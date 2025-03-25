import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AmountInput } from './AmountInput';

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('AmountInput', () => {
  beforeEach(() => {
    global.ResizeObserver = ResizeObserverMock;
    vi.clearAllMocks();
  });

  const defaultProps = {
    asset: 'ETH',
    currency: 'USD',
    fiatAmount: '',
    cryptoAmount: '',
    selectedInputType: 'fiat' as const,
    setFiatAmount: vi.fn(),
    setCryptoAmount: vi.fn(),
    exchangeRate: '1200',
  };

  it('renders correctly with fiat input type', () => {
    render(<AmountInput {...defaultProps} />);
    expect(screen.getByTestId('ockTextInput_Input')).toBeInTheDocument();
    expect(screen.getByTestId('ockCurrencySpan')).toHaveTextContent('USD');
  });

  it('renders correctly with crypto input type', () => {
    render(<AmountInput {...defaultProps} selectedInputType="crypto" />);
    expect(screen.getByTestId('ockCurrencySpan')).toHaveTextContent('ETH');
  });

  it('handles input change in fiat mode', () => {
    render(<AmountInput {...defaultProps} />);
    const input = screen.getByTestId('ockTextInput_Input');

    fireEvent.change(input, { target: { value: '100' } });
    expect(defaultProps.setFiatAmount).toHaveBeenCalledWith('100');
  });

  it('handles input change in crypto mode', () => {
    render(<AmountInput {...defaultProps} selectedInputType="crypto" />);
    const input = screen.getByTestId('ockTextInput_Input');

    fireEvent.change(input, { target: { value: '1' } });
    expect(defaultProps.setCryptoAmount).toHaveBeenCalledWith('1');
  });

  it('applies custom className', () => {
    render(<AmountInput {...defaultProps} className="custom-class" />);
    expect(screen.getByTestId('ockAmountInputContainer')).toHaveClass(
      'custom-class',
    );
  });

  it('updates width based on currency label', async () => {
    const mockResizeObserver = vi.fn();
    global.ResizeObserver = vi.fn().mockImplementation((callback) => {
      callback([
        {
          contentRect: { width: 300 },
          target: document.createElement('div'),
        },
      ]);
      return {
        observe: mockResizeObserver,
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    render(<AmountInput {...defaultProps} />);
    const input = screen.getByTestId('ockTextInput_Input');
    const container = screen.getByTestId('ockAmountInputContainer');

    Object.defineProperty(container, 'getBoundingClientRect', {
      value: () => ({ width: 300 }),
      configurable: true,
    });

    const currencyLabel = screen.getByTestId('ockCurrencySpan');
    Object.defineProperty(currencyLabel, 'getBoundingClientRect', {
      value: () => ({ width: 50 }),
      configurable: true,
    });

    act(() => {
      fireEvent.change(input, { target: { value: '100' } });
      window.dispatchEvent(new Event('resize'));
    });
  });

  it('focuses input when input type changes', () => {
    const { rerender } = render(<AmountInput {...defaultProps} />);
    const input = screen.getByTestId('ockTextInput_Input');
    const focusSpy = vi.spyOn(input, 'focus');

    rerender(<AmountInput {...defaultProps} selectedInputType="crypto" />);
    expect(focusSpy).toHaveBeenCalled();
  });

  it('displays placeholder when value is empty', () => {
    render(<AmountInput {...defaultProps} />);
    const input = screen.getByTestId('ockTextInput_Input');
    expect(input).toHaveAttribute('placeholder', '0');
  });

  it('updates hidden span content correctly', () => {
    const { rerender } = render(<AmountInput {...defaultProps} />);
    const hiddenSpan = screen.getByTestId('ockHiddenSpan');
    expect(hiddenSpan).toHaveTextContent('0.');

    rerender(<AmountInput {...defaultProps} fiatAmount="100" />);
    expect(hiddenSpan).toHaveTextContent('100.');
  });

  it('prevents invalid input', () => {
    render(<AmountInput {...defaultProps} />);
    const input = screen.getByTestId('ockTextInput_Input');

    fireEvent.change(input, { target: { value: 'abc' } });
    expect(defaultProps.setFiatAmount).not.toHaveBeenCalled();
  });

  it('maintains focus after value change', () => {
    render(<AmountInput {...defaultProps} />);
    const input = screen.getByTestId('ockTextInput_Input');

    input.focus();
    fireEvent.change(input, { target: { value: '100' } });
    expect(document.activeElement).toBe(input);
  });
});
