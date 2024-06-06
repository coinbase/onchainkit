/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { TokenSelector } from './TokenSelector';

describe('TokenSelector', () => {
  const token = {
    name: 'Ethereum',
    address: '0x123' as Address,
    symbol: 'ETH',
    decimals: 18,
    image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    blockchain: 'eth',
    chainId: 8453,
  };

  const setToken = jest.fn();
  const children = <div data-testid="ockTokenSelector_MockChildren">component</div>;

  it('renders correctly without a token', () => {
    render(
      <TokenSelector token={undefined} setToken={setToken}>
        {children}
      </TokenSelector>,
    );

    expect(screen.getByText('Select')).toBeInTheDocument();
    expect(screen.queryByTestId('ockTokenSelector_Symbol')).toBeNull();
    expect(screen.getByTestId('ockTokenSelector_CaretDown')).toBeInTheDocument();
  });

  it('renders correctly with a token', () => {
    render(
      <TokenSelector token={token} setToken={setToken}>
        {children}
      </TokenSelector>,
    );

    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByTestId('ockTokenSelector_CaretDown')).toBeInTheDocument();
    expect(screen.queryByText('Select')).toBeNull();
  });

  it('toggles dropdown on button click', () => {
    render(
      <TokenSelector token={token} setToken={setToken}>
        {children}
      </TokenSelector>,
    );

    const button = screen.getByTestId('ockTokenSelector_Button');
    fireEvent.click(button);

    expect(screen.getByTestId('ockTokenSelector_CaretUp')).toBeInTheDocument();
    expect(screen.getByTestId('ockTokenSelector_MockChildren')).toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.getByTestId('ockTokenSelector_CaretDown')).toBeInTheDocument();
    expect(screen.queryByTestId('ockTokenSelector_MockChildren')).toBeNull();
  });
});
