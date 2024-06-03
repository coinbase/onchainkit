/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Address } from 'viem';
import { TokenSelectorButton } from './TokenSelectorButton';

const handleClick = jest.fn();

describe('TokenSelectorButton Component', () => {
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
    render(<TokenSelectorButton token={token} onClick={handleClick} />);
    const tokenSelectorButton = screen.getByTestId('TokenSelectorButton');
    expect(tokenSelectorButton).toBeInTheDocument();

    const imgElement = within(tokenSelectorButton).getByRole('img');
    const spanElement = within(tokenSelectorButton).getByText(token.symbol);

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
    render(<TokenSelectorButton token={token} onClick={handleClick} />);
    const tokenSelectorButton = screen.getByTestId('TokenSelectorButton');
    expect(tokenSelectorButton).toBeInTheDocument();

    const imgElement = screen.queryByRole('img');
    const spanElement = within(tokenSelectorButton).getByText(token.symbol);

    expect(imgElement).toBeInTheDocument();
    expect(spanElement).toBeInTheDocument();
  });

  it('should render a placeholder when token is undefined', async () => {
    render(<TokenSelectorButton onClick={handleClick} />);
    const tokenSelector = screen.getByTestId('TokenSelectorButton');
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
    render(<TokenSelectorButton token={token} onClick={handleClick} />);

    const tokenSelector = screen.getByTestId('TokenSelectorButton');

    fireEvent.click(tokenSelector);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
