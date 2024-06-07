/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Address } from 'viem';
import { TokenSelectorDropdown } from './TokenSelectorDropdown';
import { Token } from '../types';

describe('TokenSelectorDropdown', () => {
  const handleSetToken = jest.fn();
  const handleToggle = jest.fn();
  const tokens: Token[] = [
    {
      name: 'Ethereum',
      address: '' as Address,
      symbol: 'ETH',
      decimals: 18,
      image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
      chainId: 8453,
    },
    {
      name: 'USDC',
      address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as Address,
      symbol: 'USDC',
      decimals: 6,
      image:
        'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
      chainId: 8453,
    },
  ];

  it('renders the TokenSelectorDropdown component', () => {
    render(
      <TokenSelectorDropdown setToken={handleSetToken} options={tokens} onToggle={handleToggle} />,
    );

    const result = screen.getAllByTestId('ockTokenRow_Container');
    expect(result.length).toEqual(tokens.length);
  });

  test('calls setToken and onToggle when a TokenRow is clicked', () => {
    render(
      <TokenSelectorDropdown setToken={handleSetToken} options={tokens} onToggle={handleToggle} />,
    );

    const elements = screen.getAllByTestId('ockTokenRow_Container');

    elements.forEach((element) => {
      fireEvent.click(element);
    });

    expect(handleSetToken).toHaveBeenCalledTimes(tokens.length);
    expect(handleToggle).toHaveBeenCalledTimes(tokens.length);
  });
});
