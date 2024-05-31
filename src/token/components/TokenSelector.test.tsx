/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { TokenSelector, useFilteredTokens } from './TokenSelector';
import { Token } from '../types';

const tokens: Token[] = [
  {
    name: 'ETH',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'ETH',
    decimals: 18,
    image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
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
  {
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    decimals: 18,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/47/bc/47bc3593c2dec7c846b66b7ba5f6fa6bd69ec34f8ebb931f2a43072e5aaac7a8-YmUwNmRjZDUtMjczYy00NDFiLWJhZDUtMzgwNjFmYWM0Njkx',
    chainId: 8453,
  },
];

describe('TokenSelector Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render list of tokens', () => {
    const handleSelect = jest.fn();
    const handleClose = jest.fn();

    render(<TokenSelector tokens={tokens} onSelect={handleSelect} onClose={handleClose} />);

    const tokenChips = screen.getByTestId('ockTokenSelector_TokenChips');
    const tokenList = screen.getByTestId('ockTokenSelector_TokenList');

    expect(tokenChips.children.length).toEqual(tokens.length);
    expect(tokenList.children.length).toEqual(tokens.length);
  });

  it('should filter list of tokens given an input', () => {
    const handleSelect = jest.fn();
    const handleClose = jest.fn();

    render(<TokenSelector tokens={tokens} onSelect={handleSelect} onClose={handleClose} />);

    const textInput = screen.getByTestId('ockTextInput_Search');

    // Insert text "world" into the input element
    fireEvent.change(textInput, { target: { value: 'eth' } });

    const tokenChips = screen.getByTestId('ockTokenSelector_TokenChips');
    const tokenList = screen.getByTestId('ockTokenSelector_TokenList');

    expect(tokenChips.children.length).toEqual(2);
    expect(tokenList.children.length).toEqual(2);
  });

  it('should show no results', async () => {
    const handleSelect = jest.fn();
    const handleClose = jest.fn();

    render(<TokenSelector tokens={tokens} onSelect={handleSelect} onClose={handleClose} />);

    const textInput = screen.getByTestId('ockTextInput_Search');

    // Insert text "world" into the input element
    fireEvent.change(textInput, { target: { value: 'tothemoon' } });

    const tokenChips = screen.queryByTestId('ockTokenSelector_TokenChips');
    const tokenList = screen.queryByTestId('ockTokenSelector_TokenList');
    const noResult = screen.getByTestId('ockTokenSelector_NoResult');

    expect(tokenChips).not.toBeInTheDocument();
    expect(tokenList).not.toBeInTheDocument();
    expect(noResult).toBeInTheDocument();
  });
});

describe('useFilteredTokens', () => {
  it('should filter tokens by name', () => {
    const { result } = renderHook(() => useFilteredTokens(tokens, 'wrapped'));
    expect(result.current).toEqual([tokens[3]]);
  });

  it('should filter tokens by symbol', () => {
    const { result } = renderHook(() => useFilteredTokens(tokens, 'eth'));
    expect(result.current).toEqual([tokens[0], tokens[3]]);
  });

  it('should filter tokens by address', () => {
    const { result } = renderHook(() =>
      useFilteredTokens(tokens, '0x50c5725949a6f0c72e6c4a641f24049a917db0cb'),
    );
    expect(result.current).toEqual([tokens[2]]);
  });

  it('should return all tokens if filter value is empty', () => {
    const { result } = renderHook(() => useFilteredTokens(tokens, ''));
    expect(result.current).toEqual(tokens);
  });

  it('should return no tokens if no match is found', () => {
    const { result } = renderHook(() => useFilteredTokens(tokens, 'tothemooooooon'));
    expect(result.current).toEqual([]);
  });
});
