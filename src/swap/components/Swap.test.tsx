/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { Swap } from './Swap';
import { SwapContext } from '../context';
import { SwapAmountInput } from './SwapAmountInput';
import { SwapButton } from './SwapButton';
import { SwapToggleButton } from './SwapToggleButton';
import { SwapMessage } from './SwapMessage';
import type { Address } from 'viem';
import type { Token } from '../../token';
import type { SwapContextType } from '../types';

jest.mock('wagmi', () => {
  return {
    useBalance: jest.fn(),
    useReadContract: jest.fn(),
  };
});

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

const mockTokenBalanceResponse = { data: 3304007277394n };
const mockEthBalanceResponse = {
  data: {
    decimals: 18,
    formatted: '0.0002851826238227',
    symbol: 'ETH',
    value: 285182623822700n,
  },
};

const mockContextValue = {
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
  fromAmount: '10',
  handleFromAmountChange: jest.fn(),
  handleToAmountChange: jest.fn(),
  handleToggle: jest.fn(),
  setError: jest.fn(),
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
  error: undefined,
} as SwapContextType;

describe('Swap component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default title', async () => {
    (require('wagmi').useBalance as jest.Mock).mockReturnValue(
      mockEthBalanceResponse,
    );
    (require('wagmi').useReadContract as jest.Mock).mockReturnValue(
      mockTokenBalanceResponse,
    );
    render(
      <SwapContext.Provider value={mockContextValue}>
        <Swap address="0x123">
          <SwapAmountInput label="Sell" token={mockETHToken} type="from" />
          <SwapToggleButton />
          <SwapAmountInput label="Buy" token={mockToken} type="to" />
          <SwapButton />
          <SwapMessage />
        </Swap>
      </SwapContext.Provider>,
    );
    await waitFor(() => {
      const title = screen.getByTestId('ockSwap_Title');
      expect(title).toBeInTheDocument();
    });
  });

  it('should render with custom title', () => {
    const title = 'Hello Onchain';
    render(
      <Swap address="0x123" title={title}>
        <div />
        <div />
      </Swap>,
    );
    const element = screen.getByText(title);
    expect(element).toBeInTheDocument();
  });

  it('renders from token input with max button and balance', () => {
    (require('wagmi').useBalance as jest.Mock).mockReturnValue(
      mockEthBalanceResponse,
    );

    render(
      <SwapContext.Provider value={mockContextValue}>
        <Swap address="0x123">
          <SwapAmountInput label="Sell" token={mockETHToken} type="from" />
          <SwapToggleButton />
          <SwapAmountInput label="Buy" token={mockToken} type="to" />
          <SwapButton />
          <SwapMessage />
        </Swap>
      </SwapContext.Provider>,
    );
    expect(screen.getByText('Balance: 0.00028518')).toBeInTheDocument();
    expect(
      screen.getByTestId('ockSwapAmountInput_MaxButton'),
    ).toBeInTheDocument();
  });
});
