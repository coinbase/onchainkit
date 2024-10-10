import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Token } from '../types';
import { TokenSelectDropdown } from './TokenSelectDropdown';

vi.mock('../../useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('TokenSelectDropdown', () => {
  const setToken = vi.fn();
  const options: Token[] = [
    {
      name: 'Ethereum',
      address: '' as Address,
      symbol: 'ETH',
      decimals: 18,
      image:
        'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
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
    vi.clearAllMocks();
  });

  it('renders the TokenSelectDropdown component', async () => {
    render(<TokenSelectDropdown setToken={setToken} options={options} />);

    await waitFor(() => {
      const button = screen.getByTestId('ockTokenSelectButton_Button');
      const list = screen.queryByTestId('ockTokenSelectDropdown_List');
      expect(button).toBeInTheDocument();
      expect(list).toBeNull();
    });
  });

  it('calls setToken when clicking on a token', async () => {
    render(<TokenSelectDropdown setToken={setToken} options={options} />);

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);

    await waitFor(() => {
      fireEvent.click(screen.getByText(options[0].name));

      expect(setToken).toHaveBeenCalledWith(options[0]);
    });
  });

  it('toggles when clicking outside the component', async () => {
    render(<TokenSelectDropdown setToken={setToken} options={options} />);

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);

    expect(
      screen.getByTestId('ockTokenSelectDropdown_List'),
    ).toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.queryByTestId('ockTokenSelectDropdown_List')).toBeNull();
  });
});
