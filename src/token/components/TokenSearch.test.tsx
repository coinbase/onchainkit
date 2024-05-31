/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { TokenSearch } from './TokenSearch';
import { Token } from '../types';

const tokens: Token[] = [
  {
    name: 'Ethereum',
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

jest.mock('./useDebounce', () => ({
  __esModule: true,
  useDebounce: (fn: (tokens: Token[]) => void) => {
    return fn;
  },
}));

describe('TokenSearch', () => {
  it('Search tokens based on input value', async () => {
    const onSearch = jest.fn();

    const { getByPlaceholderText } = render(
      <TokenSearch tokens={tokens} onSearch={onSearch} delayMs={200} />,
    );

    const input = getByPlaceholderText('Search name or paste address');

    fireEvent.change(input, { target: { value: 'Ethereum' } });

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith([tokens[0]]);
    });

    fireEvent.change(input, { target: { value: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb' } });

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith([tokens[2]]);
    });

    fireEvent.change(input, { target: { value: 'Weth' } });

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith([tokens[3]]);
    });
  });
});
