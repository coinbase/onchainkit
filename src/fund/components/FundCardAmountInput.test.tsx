import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FundCardAmountInputPropsReact } from '../types';
import { FundCardAmountInput } from './FundCardAmountInput';

describe('FundCardAmountInput', () => {
  const defaultProps: FundCardAmountInputPropsReact = {
    fiatValue: '100',
    setFiatValue: vi.fn(),
    cryptoValue: '0.05',
    setCryptoValue: vi.fn(),
    currencySign: '$',
    assetSymbol: 'ETH',
    inputType: 'fiat',
    exchangeRate: 2,
  };

  it('renders correctly with fiat input type', () => {
    render(<FundCardAmountInput {...defaultProps} />);
    expect(screen.getByTestId('ockFundCardAmountInput')).toBeInTheDocument();
    expect(screen.getByTestId('currencySpan')).toHaveTextContent('$');
  });

  it('renders correctly with crypto input type', () => {
    render(<FundCardAmountInput {...defaultProps} inputType="crypto" />);
    expect(screen.getByTestId('currencySpan')).toHaveTextContent('ETH');
  });

  it('handles fiat input change', () => {
    render(<FundCardAmountInput {...defaultProps} />);
    const input = screen.getByTestId('ockFundCardAmountInput');
    fireEvent.change(input, { target: { value: '10' } });
    expect(defaultProps.setFiatValue).toHaveBeenCalledWith('10');
    expect(defaultProps.setCryptoValue).toHaveBeenCalledWith('20');
  });

  it('handles crypto input change', () => {
    render(<FundCardAmountInput {...defaultProps} inputType="crypto" />);
    const input = screen.getByTestId('ockFundCardAmountInput');
    fireEvent.change(input, { target: { value: '0.1' } });
    expect(defaultProps.setCryptoValue).toHaveBeenCalledWith('0.1');
    expect(defaultProps.setFiatValue).toHaveBeenCalledWith('0.05');
  });

  it('formats input value correctly when starting with a dot', () => {
    render(<FundCardAmountInput {...defaultProps} />);
    const input = screen.getByTestId('ockFundCardAmountInput');
    fireEvent.change(input, { target: { value: '.5' } });
    expect(defaultProps.setFiatValue).toHaveBeenCalledWith('0.5');
  });

  it('formats input value correctly when starting with zero', () => {
    render(<FundCardAmountInput {...defaultProps} />);
    const input = screen.getByTestId('ockFundCardAmountInput');
    fireEvent.change(input, { target: { value: '01' } });
    expect(defaultProps.setFiatValue).toHaveBeenCalledWith('0.1');
    expect(defaultProps.setCryptoValue).toHaveBeenCalledWith('0.2');
  });

  it('limits decimal places to two', () => {
    render(<FundCardAmountInput {...defaultProps} />);
    const input = screen.getByTestId('ockFundCardAmountInput');
    fireEvent.change(input, { target: { value: '123.456' } });
    expect(defaultProps.setFiatValue).toHaveBeenCalledWith('123.45');
  });

  it('focuses input when input type changes', () => {
    const { rerender } = render(<FundCardAmountInput {...defaultProps} />);
    const input = screen.getByTestId('ockFundCardAmountInput');
    const focusSpy = vi.spyOn(input, 'focus');
    rerender(<FundCardAmountInput {...defaultProps} inputType="crypto" />);
    expect(focusSpy).toHaveBeenCalled();
  });

  it('sets crypto value to empty string when input is "0"', () => {
    render(<FundCardAmountInput {...defaultProps} />);
    const input = screen.getByTestId('ockFundCardAmountInput');
    fireEvent.change(input, { target: { value: '0' } });
    expect(defaultProps.setCryptoValue).toHaveBeenCalledWith('');
  });

  it('sets fiat value to empty string when crypto input is "0"', () => {
    render(<FundCardAmountInput {...defaultProps} inputType="crypto" />);
    const input = screen.getByTestId('ockFundCardAmountInput');
    fireEvent.change(input, { target: { value: '0' } });
    expect(defaultProps.setFiatValue).toHaveBeenCalledWith('');
  });

  it('correctly handles when exchange rate is not available', () => {
    render(<FundCardAmountInput {...defaultProps} exchangeRate={undefined} />);
    const input = screen.getByTestId('ockFundCardAmountInput');
    fireEvent.change(input, { target: { value: '200' } });
    expect(defaultProps.setCryptoValue).toHaveBeenCalledWith('');
    expect(defaultProps.setFiatValue).toHaveBeenCalledWith('200');
  });

  it('hidden span has correct text value when value exist', async () => {
    render(<FundCardAmountInput {...defaultProps} />);
    const hiddenSpan = screen.getByTestId('ockHiddenSpan');

    expect(hiddenSpan).toHaveTextContent('100.');
  });

  it('hidden span has correct text value when value does not exist', async () => {
    render(<FundCardAmountInput {...defaultProps} fiatValue="" />);
    const hiddenSpan = screen.getByTestId('ockHiddenSpan');

    expect(hiddenSpan).toHaveTextContent('0.');
  });
});
