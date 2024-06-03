/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Address } from 'viem';
import { TokenSelector } from './TokenSelector';

const handleClick = jest.fn();

describe('TokenSelector Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', async () => {
    const token = {
      address: '0x123' as Address,
      chainId: 1,
      decimals: 2,
      image: 'imageURL',
      name: 'Ether',
      symbol: 'ETH',
    };
    render(<TokenSelector token={token} onClick={handleClick} />);
    const tokenSelector = screen.getByTestId('TokenSelector');
    expect(tokenSelector).toBeInTheDocument();

    const imgElement = within(tokenSelector).getByRole('img');
    const spanElement = within(tokenSelector).getByText(token.symbol);

    expect(imgElement).toBeInTheDocument();
    expect(spanElement).toBeInTheDocument();
  });

  it('should render without an image', async () => {
    const token = {
      address: '0x123' as Address,
      chainId: 1,
      decimals: 2,
      image: null,
      name: 'Ether',
      symbol: 'ETH',
    };
    render(<TokenSelector token={token} onClick={handleClick} />);
    const tokenSelector = screen.getByTestId('TokenSelector');
    expect(tokenSelector).toBeInTheDocument();

    const imgElement = screen.queryByRole('img');
    const spanElement = within(tokenSelector).getByText(token.symbol);

    expect(imgElement).toBeInTheDocument();
    expect(spanElement).toBeInTheDocument();
  });

  it('should render a placeholder when token is undefined', async () => {
    render(<TokenSelector onClick={handleClick} />);
    const tokenSelector = screen.getByTestId('TokenSelector');
    expect(tokenSelector).toBeInTheDocument();

    const spanElement = within(tokenSelector).getByText('Select');

    expect(spanElement).toBeInTheDocument();
  });

  it('should register a click on press', async () => {
    const token = {
      address: '0x123' as Address,
      chainId: 1,
      decimals: 2,
      image: 'imageURL',
      name: 'Ether',
      symbol: 'ETH',
    };
    render(<TokenSelector token={token} onClick={handleClick} />);

    const tokenSelector = screen.getByTestId('TokenSelector');

    fireEvent.click(tokenSelector);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
