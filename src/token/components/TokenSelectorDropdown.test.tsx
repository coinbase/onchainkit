/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Address } from 'viem';
import { TokenSelectorDropdown } from './TokenSelectorDropdown';
import { Token } from '../types';

describe('TokenSelectorDropdown', () => {
  const setToken = jest.fn();
  const onToggle = jest.fn();
  const options: Token[] = [
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the TokenSelectorDropdown component', () => {
    render(<TokenSelectorDropdown setToken={setToken} options={options} onToggle={onToggle} />);

    const result = screen.getAllByTestId('ockTokenRow_Container');
    expect(result.length).toEqual(options.length);
  });

  it('calls setToken and onToggle when clicking on a token', async () => {
    render(<TokenSelectorDropdown setToken={setToken} onToggle={onToggle} options={options} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText(options[0].name));

      expect(setToken).toHaveBeenCalledWith(options[0]);
      expect(onToggle).toHaveBeenCalled();
    });
  });

  it('calls onToggle when clicking outside the component', async () => {
    render(<TokenSelectorDropdown setToken={setToken} onToggle={onToggle} options={options} />);

    await waitFor(() => {
      fireEvent.click(document);

      expect(onToggle).toHaveBeenCalled();
    });
  });

  it('does not call onToggle when onToggle is not provided', async () => {
    render(<TokenSelectorDropdown setToken={setToken} options={options} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText(options[0].name));

      expect(setToken).toHaveBeenCalledWith(options[0]);
      expect(onToggle).not.toHaveBeenCalled();
    });

    await waitFor(() => {
      fireEvent.click(document);
      expect(onToggle).not.toHaveBeenCalled();
    });
  });
});
