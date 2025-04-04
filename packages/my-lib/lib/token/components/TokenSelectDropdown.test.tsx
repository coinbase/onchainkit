import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Token } from '../types';
import { TokenSelectDropdown } from './TokenSelectDropdown';

vi.mock('react-dom', () => ({
  createPortal: (node: React.ReactNode) => node,
}));

vi.mock('@/internal/hooks/useTheme', () => ({
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
      image: 'https://example.com/eth.png',
      chainId: 8453,
    },
    {
      name: 'USDC',
      address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as Address,
      symbol: 'USDC',
      decimals: 6,
      image: 'https://example.com/usdc.png',
      chainId: 8453,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the TokenSelectDropdown component', () => {
    render(<TokenSelectDropdown setToken={setToken} options={options} />);

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    expect(button).toBeInTheDocument();
    expect(screen.queryByTestId('ockDropdownMenu')).not.toBeInTheDocument();
  });

  it('opens dropdown menu when clicking the button', async () => {
    render(<TokenSelectDropdown setToken={setToken} options={options} />);

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('ockDropdownMenu')).toBeInTheDocument();
      expect(screen.getByText(options[0].name)).toBeInTheDocument();
    });
  });

  it('calls setToken and closes dropdown when selecting a token', async () => {
    render(<TokenSelectDropdown setToken={setToken} options={options} />);

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);
    await waitFor(() => {
      const tokenOption = screen.getByText(options[0].name);
      fireEvent.click(tokenOption);
    });

    expect(setToken).toHaveBeenCalledWith(options[0]);
    expect(screen.queryByTestId('ockDropdownMenu')).not.toBeInTheDocument();
  });

  it('renders with a selected token', () => {
    render(
      <TokenSelectDropdown
        setToken={setToken}
        options={options}
        token={options[0]}
      />,
    );

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText(options[0].symbol)).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    render(<TokenSelectDropdown setToken={setToken} options={options} />);

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('ockDropdownMenu')).toBeInTheDocument();
    });

    fireEvent.keyDown(document.body, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByTestId('ockDropdownMenu')).not.toBeInTheDocument();
    });
  });

  it('toggles dropdown state when clicking the button multiple times', async () => {
    render(<TokenSelectDropdown setToken={setToken} options={options} />);

    const button = screen.getByTestId('ockTokenSelectButton_Button');

    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByTestId('ockDropdownMenu')).toBeInTheDocument();
    });

    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.queryByTestId('ockDropdownMenu')).not.toBeInTheDocument();
    });

    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByTestId('ockDropdownMenu')).toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking escape key', async () => {
    render(<TokenSelectDropdown setToken={setToken} options={options} />);

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('ockDropdownMenu')).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByTestId('ockDropdownMenu')).not.toBeInTheDocument();
    });
  });
});
