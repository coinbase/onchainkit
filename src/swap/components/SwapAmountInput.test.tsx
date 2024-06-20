/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SwapAmountInput } from './SwapAmountInput';
import { SwapContext } from '../context';
import type { Token } from '../../token';
import type { SwapContextType } from '../types';
import type { Address } from 'viem';

jest.mock('../../token', () => ({
  TokenChip: jest.fn(() => <div>TokenChip</div>),
  TokenSelectDropdown: jest.fn(() => <div>TokenSelectDropdown</div>),
}));

const mockETHTokenBalanceResponse = { data: 3304007277394n };
const mockEthBalanceResponse = {
  data: {
    decimals: 18,
    formatted: '0.0002851826238227',
    symbol: 'ETH',
    value: 285182623822700n,
  },
};

const mockETHToken: Token = {
  name: 'ETH',
  address: '0x123456789',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: 8453,
};

const mockToken: Token = {
  name: 'USDC',
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: 8453,
};

const mockContextValue = {
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
  convertedFromTokenBalance: '0.0002851826238227',
  fromAmount: '10',
  handleFromAmountChange: jest.fn(),
  handleToAmountChange: jest.fn(),
  handleToggle: jest.fn(),
  setError: jest.fn(),
  roundedFromTokenBalance: '0.00028518',
  roundedToTokenBalance: '3304007.277394',
  setFromAmount: jest.fn(),
  setFromToken: jest.fn(),
  setToAmount: jest.fn(),
  setToToken: jest.fn(),
  setSwapErrorState: jest.fn(),
  setSwapLoadingState: jest.fn(),
  swapLoadingState: {
    isFromQuoteLoading: false,
    isSwapLoading: false,
    isToQuoteLoading: false,
  },
  toAmount: '20',
  toToken: mockToken,
  fromToken: mockETHToken,
} as SwapContextType;

const mockContextValueWithoutConvertedBalance = {
  ...mockContextValue,
  convertedFromTokenBalance: undefined,
};

const mockSwappableTokens: Token[] = [
  {
    name: 'Ethereum',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image:
      'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    chainId: 8453,
  },
  {
    name: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDC',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
    chainId: 8453,
  },
  {
    name: 'Dai',
    address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
    symbol: 'DAI',
    decimals: 18,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/d0/d7/d0d7784975771dbbac9a22c8c0c12928cc6f658cbcf2bbbf7c909f0fa2426dec-NmU4ZWViMDItOTQyYy00Yjk5LTkzODUtNGJlZmJiMTUxOTgy',
    chainId: 8453,
  },
];

describe('SwapAmountInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with the correct label and token', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="From" token={mockETHToken} type="from" />
      </SwapContext.Provider>,
    );

    expect(screen.getByText('From')).toBeInTheDocument();
  });

  it('renders from token input with max button and balance', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="From" token={mockETHToken} type="from" />
      </SwapContext.Provider>,
    );
    expect(screen.getByText('Balance: 0.00028518')).toBeInTheDocument();
    expect(
      screen.getByTestId('ockSwapAmountInput_MaxButton'),
    ).toBeInTheDocument();
  });

  it('does not render max button for to token input', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="From" token={mockETHToken} type="to" />
      </SwapContext.Provider>,
    );
    expect(
      screen.queryByTestId('ockSwapAmountInput_MaxButton'),
    ).not.toBeInTheDocument();
  });

  it('updates input value with balance amount on max button click', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="From" token={mockETHToken} type="from" />
      </SwapContext.Provider>,
    );

    const maxButton = screen.getByTestId('ockSwapAmountInput_MaxButton');
    fireEvent.click(maxButton);

    expect(mockContextValue.setFromAmount).toHaveBeenCalledWith(
      '0.0002851826238227',
    );
  });

  it('does not update input value with balance amount on max button click when convertedBalance is undefined', () => {
    render(
      <SwapContext.Provider value={mockContextValueWithoutConvertedBalance}>
        <SwapAmountInput label="From" token={mockETHToken} type="from" />
      </SwapContext.Provider>,
    );

    const maxButton = screen.getByTestId('ockSwapAmountInput_MaxButton');
    fireEvent.click(maxButton);

    expect(mockContextValue.setFromAmount).not.toHaveBeenCalled();
  });

  it('displays the correct amount when this type is "from"', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="From" token={mockETHToken} type="from" />
      </SwapContext.Provider>,
    );

    const input = screen.getByTestId('ockTextInput_Input');
    expect(input).toHaveValue('10');
  });

  it('displays the correct amount when this type is "to"', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="To" token={mockETHToken} type="to" />
      </SwapContext.Provider>,
    );

    const input = screen.getByTestId('ockTextInput_Input');
    expect(input).toHaveValue('20');
  });

  it('calls setFromAmount when type is "from" and valid input is entered', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="From" token={mockETHToken} type="from" />
      </SwapContext.Provider>,
    );

    const input = screen.getByTestId('ockTextInput_Input');
    fireEvent.change(input, { target: { value: '15' } });

    expect(mockContextValue.setFromAmount).toHaveBeenCalledWith('15');
  });

  it('calls setToAmount when type is "to" and valid input is entered', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="From" token={mockETHToken} type="to" />
      </SwapContext.Provider>,
    );

    const input = screen.getByTestId('ockTextInput_Input');
    fireEvent.change(input, { target: { value: '15' } });

    expect(mockContextValue.setToAmount).toHaveBeenCalledWith('15');
  });

  it('does not call setAmount when invalid input is entered', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="From" token={mockETHToken} type="from" />
      </SwapContext.Provider>,
    );

    const input = screen.getByTestId('ockTextInput_Input');
    fireEvent.change(input, { target: { value: 'invalid' } });

    expect(mockContextValue.setFromAmount).not.toHaveBeenCalled();
  });

  it('calls setFromToken when type is "from" and token prop is provided', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="From" token={mockETHToken} type="from" />
      </SwapContext.Provider>,
    );

    expect(mockContextValue.setFromToken).toHaveBeenCalledWith(mockETHToken);
  });

  it('calls setToToken when type is "to" and token prop is provided', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="To" token={mockETHToken} type="to" />
      </SwapContext.Provider>,
    );

    expect(mockContextValue.setToToken).toHaveBeenCalledWith(mockETHToken);
  });

  it('renders the correct balance', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="To" token={mockToken} type="to" />
      </SwapContext.Provider>,
    );

    expect(screen.getByText('Balance: 3304007.277394')).toBeInTheDocument();
  });

  it('renders a TokenSelectDropdown component if swappableTokens are passed as prop', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput
          label="To"
          swappableTokens={mockSwappableTokens}
          token={mockToken}
          type="to"
        />
      </SwapContext.Provider>,
    );

    const dropdown = screen.getByText('TokenSelectDropdown');
    expect(dropdown).toBeInTheDocument();
  });

  it('renders a TokenChip component if swappableTokens are not passed as prop', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapAmountInput label="To" token={mockToken} type="to" />
      </SwapContext.Provider>,
    );

    const dropdown = screen.getByText('TokenChip');
    expect(dropdown).toBeInTheDocument();
  });
});
