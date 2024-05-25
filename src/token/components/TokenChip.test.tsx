/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { Address } from 'viem';
import { TokenChip } from './TokenChip';

describe('TokenChip Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render and register a click when pressed', async () => {
    const token = {
      address: '0x123' as Address,
      chainId: 1,
      decimals: 2,
      image: 'imageURL',
      name: 'Ether',
      symbol: 'ETH',
    };
    render(<TokenChip token={token} />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();

    const imgElement = within(buttonElement).getByRole('img');
    const spanElement = within(buttonElement).getByText(token.symbol);

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
    render(<TokenChip token={token} />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();

    const imgElement = screen.queryByRole('img');
    const spanElement = within(buttonElement).getByText(token.symbol);

    expect(imgElement).toBeInTheDocument();
    expect(spanElement).toBeInTheDocument();
  });
});
