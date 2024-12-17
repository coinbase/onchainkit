import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FundCardAmountInput } from './FundCardAmountInput';
import type { FundCardAmountInputPropsReact } from '../types';

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: () => 'mocked-theme-class',
}));

describe('FundCardAmountInput', () => {
  const defaultProps = {
    fiatValue: '100',
    setFiatValue: vi.fn(),
    cryptoValue: '0.05',
    setCryptoValue: vi.fn(),
    currencySign: '$',
    assetSymbol: 'ETH',
    inputType: 'fiat',
    exchangeRate: '2',
  } as unknown as FundCardAmountInputPropsReact;

  it('renders correctly with fiat input type', () => {
    render(<FundCardAmountInput {...defaultProps} />);
    expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('renders correctly with crypto input type', () => {
    render(<FundCardAmountInput {...defaultProps} inputType="crypto" />);
    expect(screen.getByText('ETH')).toBeInTheDocument();
  });

  it('handles fiat input change', () => {
    render(<FundCardAmountInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '10' } });
    expect(defaultProps.setFiatValue).toHaveBeenCalledWith('10');
    expect(defaultProps.setCryptoValue).toHaveBeenCalledWith('5');
  });

  it('handles crypto input change', () => {
    render(<FundCardAmountInput {...defaultProps} inputType="crypto" />);
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '0.1' } });
    expect(defaultProps.setCryptoValue).toHaveBeenCalledWith('0.1');
    expect(defaultProps.setFiatValue).toHaveBeenCalledWith('0.05');
  });

  it('formats input value correctly when starting with a dot', () => {
    render(<FundCardAmountInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '.5' } });
    expect(defaultProps.setFiatValue).toHaveBeenCalledWith('0.5');
  });

  it('formats input value correctly when starting with zero', () => {
    render(<FundCardAmountInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '01' } });
    expect(defaultProps.setFiatValue).toHaveBeenCalledWith('0.1');
    expect(defaultProps.setCryptoValue).toHaveBeenCalledWith('0.05');
  });

  it('limits decimal places to two', () => {
    render(<FundCardAmountInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '123.456' } });
    expect(defaultProps.setFiatValue).toHaveBeenCalledWith('123.45');
  });

  it('focuses input when input type changes', () => {
    const { rerender } = render(<FundCardAmountInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;
    const focusSpy = vi.spyOn(input, 'focus');
    rerender(<FundCardAmountInput {...defaultProps} inputType="crypto" />);
    expect(focusSpy).toHaveBeenCalled();
  });

  it('does not set crypto value to "0" when input is "0"', () => {
    render(<FundCardAmountInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '0' } });
    expect(defaultProps.setCryptoValue).toHaveBeenCalledWith('');
  });

  it('does not set fiat value to "0" when crypto input is "0"', () => {
    render(<FundCardAmountInput {...defaultProps} inputType="crypto" />);
    const input = screen.getByPlaceholderText('0') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '0' } });
    expect(defaultProps.setFiatValue).toHaveBeenCalledWith('');
  });
});
