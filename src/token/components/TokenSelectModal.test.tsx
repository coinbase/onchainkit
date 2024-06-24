/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { TokenSelectModal } from './TokenSelectModal';
import type { Address } from 'viem';
import type { Token } from '../types';

const tokens: Token[] = [
  {
    name: 'Ethereum',
    address: '0x123' as Address,
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
];

describe('TokenSelectModal', () => {
  const options = tokens;
  const setToken = jest.fn();
  const token = tokens[0];

  it('renders the TokenSelectButton and does not render TokenSelectModalInner initially', () => {
    render(
      <TokenSelectModal options={options} setToken={setToken} token={token} />,
    );

    expect(
      screen.getByTestId('ockTokenSelectButton_Button'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('ockTokenSelectModal_Inner'),
    ).not.toBeInTheDocument();
  });

  it('opens the modal when the button is clicked and closes it when clicked again', () => {
    render(
      <TokenSelectModal options={options} setToken={setToken} token={token} />,
    );

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);

    expect(screen.getByTestId('ockTokenSelectModal_Inner')).toBeInTheDocument();

    fireEvent.click(button);

    expect(
      screen.queryByTestId('ockTokenSelectModal_Inner'),
    ).not.toBeInTheDocument();
  });

  it('closes the modal when the close button inside the modal is clicked', () => {
    render(
      <TokenSelectModal options={options} setToken={setToken} token={token} />,
    );

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);

    const closeButton = screen.getByTestId('TokenSelectModal_CloseButton');
    fireEvent.click(closeButton);

    expect(
      screen.queryByTestId('ockTokenSelectModal_Inner'),
    ).not.toBeInTheDocument();
  });
});
