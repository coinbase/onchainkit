/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Address } from 'viem';
import { TokenSelector } from './TokenSelector';

describe('TokenSelector Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with token prop', async () => {
    const token = {
      address: '0x123' as Address,
      chainId: 1,
      decimals: 2,
      image: 'imageURL',
      name: 'Ether',
      symbol: 'ETH',
    };
    const handleClick = jest.fn();

    render(<TokenSelector token={token} onClick={handleClick} />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();

    const imgElement = within(buttonElement).getByRole('img');
    const spanElement = within(buttonElement).getByText(token.symbol);

    expect(imgElement).toBeInTheDocument();
    expect(spanElement).toBeInTheDocument();
  });

  it('should render with no token prop with placeholder text', async () => {
    const handleClick = jest.fn();

    render(<TokenSelector token={undefined} onClick={handleClick} />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();

    const imgElement = within(buttonElement).queryByRole('img');
    const spanElement = within(buttonElement).queryByTestId('ockTokenSelector_Symbol');
    const placeholderElement = within(buttonElement).getByText('Select');

    expect(imgElement).toBeNull();
    expect(spanElement).toBeNull();
    expect(placeholderElement).toBeInTheDocument();
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
    const handleClick = jest.fn();
    render(<TokenSelector token={token} onClick={handleClick} />);

    const button = screen.getByTestId('ockTokenSelector_Button');

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
