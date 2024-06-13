/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SwapAmountInput } from './SwapAmountInput';
import { SwapContext } from '../context';
import { type Token } from '../../token';
import type { SwapContextType } from '../types';
import type { Address } from 'viem';

jest.mock('../../token', () => ({
  TokenChip: jest.fn(() => <div>TokenChip</div>),
}));

const mockContextValue = {
  fromAmount: '10',
  setFromAmount: jest.fn(),
  setFromToken: jest.fn(),
  setToAmount: jest.fn(),
  setToToken: jest.fn(),
  toAmount: '20',
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
} as SwapContextType;

const mockToken: Token = {
  name: 'ETH',
  address: '',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: 8453,
};

describe('SwapAmountInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with the correct label and token', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="From" token={mockToken} type="from" />
      </SwapContext.Provider>,
    );

    expect(screen.getByText('From')).toBeInTheDocument();
  });

  it('displays the correct amount when this type is "from"', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="From" token={mockToken} type="from" />
      </SwapContext.Provider>,
    );

    const input = screen.getByTestId('ockSwapAmountInput_Input');
    expect(input).toHaveValue('10');
  });

  it('displays the correct amount when this type is "to"', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="To" token={mockToken} type="to" />
      </SwapContext.Provider>,
    );

    const input = screen.getByTestId('ockSwapAmountInput_Input');
    expect(input).toHaveValue('20');
  });

  it('calls setFromAmount when type is "from" and valid input is entered', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="From" token={mockToken} type="from" />
      </SwapContext.Provider>,
    );

    const input = screen.getByTestId('ockSwapAmountInput_Input');
    fireEvent.change(input, { target: { value: '15' } });

    expect(mockContextValue.setFromAmount).toHaveBeenCalledWith('15');
  });

  it('calls setToAmount when type is "to" and valid input is entered', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="From" token={mockToken} type="to" />
      </SwapContext.Provider>,
    );

    const input = screen.getByTestId('ockSwapAmountInput_Input');
    fireEvent.change(input, { target: { value: '15' } });

    expect(mockContextValue.setToAmount).toHaveBeenCalledWith('15');
  });

  it('does not call setAmount when invalid input is entered', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="From" token={mockToken} type="from" />
      </SwapContext.Provider>,
    );

    const input = screen.getByTestId('ockSwapAmountInput_Input');
    fireEvent.change(input, { target: { value: 'invalid' } });

    expect(mockContextValue.setFromAmount).not.toHaveBeenCalled();
  });

  it('calls setFromToken when type is "from" and token prop is provided', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="From" token={mockToken} type="from" />
      </SwapContext.Provider>,
    );

    expect(mockContextValue.setFromToken).toHaveBeenCalledWith(mockToken);
  });

  it('calls setToToken when type is "to" and token prop is provided', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="To" token={mockToken} type="to" />
      </SwapContext.Provider>,
    );

    expect(mockContextValue.setToToken).toHaveBeenCalledWith(mockToken);
  });
});
