/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { TokenSelectButton } from './TokenSelectButton';

describe('TokenSelectButton', () => {
  const token = {
    name: 'Ethereum',
    address: '0x123' as Address,
    symbol: 'ETH',
    decimals: 18,
    image:
      'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    blockchain: 'eth',
    chainId: 8453,
  };

  it('renders correctly without a token', () => {
    render(
      <TokenSelectButton
        token={undefined}
        onClick={jest.fn()}
        isOpen={false}
      />,
    );

    expect(screen.getByText('Select token')).toBeInTheDocument();
    expect(screen.queryByTestId('ockTokenSelectButton_Symbol')).toBeNull();
    expect(
      screen.getByTestId('ockTokenSelectButton_CaretDown'),
    ).toBeInTheDocument();
  });

  it('renders correctly with a token when isOpen is true', () => {
    render(
      <TokenSelectButton token={token} onClick={jest.fn()} isOpen={false} />,
    );

    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(
      screen.getByTestId('ockTokenSelectButton_CaretDown'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('ockTokenSelectButton_CaretUp')).toBeNull();
    expect(screen.queryByText('Select token')).toBeNull();
  });

  it('renders correctly with a token when isOpen is false', () => {
    render(<TokenSelectButton token={token} onClick={jest.fn()} isOpen />);

    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(
      screen.getByTestId('ockTokenSelectButton_CaretUp'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('ockTokenSelectButton_CaretDown')).toBeNull();
    expect(screen.queryByText('Select token')).toBeNull();
  });

  it('handles click handler', () => {
    const onClick = jest.fn();
    render(
      <TokenSelectButton token={token} onClick={onClick} isOpen={false} />,
    );

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });
});
