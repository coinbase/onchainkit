/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SwapMessage } from './SwapMessage';
import { SwapContext } from '../context';
import type { Token } from '../../token';
import type { SwapContextType } from '../types';
import type { Address } from 'viem';

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
  fromAmount: '10',
  handleFromAmountChange: jest.fn(),
  handleToAmountChange: jest.fn(),
  handleToggle: jest.fn(),
  setFromAmount: jest.fn(),
  setFromToken: jest.fn(),
  setToAmount: jest.fn(),
  setToToken: jest.fn(),
  toAmount: '20',
  toToken: mockToken,
  fromToken: mockETHToken,
} as SwapContextType;

describe('SwapMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with an empty message', () => {
    render(
      <SwapContext.Provider value={mockContextValue}>
        <SwapMessage />
      </SwapContext.Provider>,
    );
    expect(screen.getByTestId('ockSwapMessage_Text')).toHaveTextContent('');
  });
});
