/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Address } from 'viem';
import { TokenChip } from './TokenChip';

describe('TokenChip Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render and register a click when pressed', async () => {
    const token = {
      name: 'Ether',
      currencyCode: 'ETH',
      imageURL: 'imageURL',
      blockchain: 'eth',
      address: '0x123' as Address,
      chainId: 1,
      decimals: 2,
      uuid: 'uuid',
    };

    const handleClick = jest.fn();

    render(<TokenChip token={token} onClick={handleClick} />);

    const buttonElement = screen.getByRole('button');

    expect(buttonElement).toBeInTheDocument();

    const imgElement = within(buttonElement).getByRole('img');
    const spanElement = within(buttonElement).getByText(token.currencyCode);

    expect(imgElement).toBeInTheDocument();
    expect(spanElement).toBeInTheDocument();

    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
