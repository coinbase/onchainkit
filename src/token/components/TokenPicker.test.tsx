import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TokenPicker } from './TokenPicker';
import type { Token } from '../types';
import React from 'react';
import { getTokens } from '../../api/getTokens';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Mock the useOnchainKit hook
vi.mock('../../useOnchainKit', () => ({
  useOnchainKit: vi.fn(() => ({
    config: {
      appearance: {
        logo: 'test-logo.png',
        name: 'Test App'
      }
    }
  }))
}));

// Mock the getTokens API
vi.mock('../../api/getTokens', () => ({
  getTokens: vi.fn(async ({ search }) => {
    if (search === 'eth') {
      return [
        {
          name: 'Ethereum',
          address: '0x123' as Address,
          symbol: 'ETH',
          decimals: 18,
          image: 'eth.png',
          chainId: 8453,
        }
      ];
    }
    return [];
  })
}));

describe('TokenPicker Component', () => {
  const defaultToken: Token = {
    name: 'Ethereum',
    address: '0x123' as Address,
    symbol: 'ETH',
    decimals: 18,
    image: 'eth.png',
    chainId: 8453,
  };

  const defaultTokens: Token[] = [
    defaultToken,
    {
      name: 'USD Coin',
      address: '0x456' as Address,
      symbol: 'USDC',
      decimals: 6,
      image: 'usdc.png',
      chainId: 8453,
    }
  ];

  const onTokenPicked = vi.fn();
  const onError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders TokenChip when modal is closed', () => {
    render(
      <TokenPicker
        pickedToken={defaultToken}
        onTokenPicked={onTokenPicked}
        defaultTokens={defaultTokens}
        onError={onError}
      />
    );

    expect(screen.getByTestId('ockTokenChip_Button')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens modal when TokenChip is clicked', () => {
    render(
      <TokenPicker
        pickedToken={defaultToken}
        onTokenPicked={onTokenPicked}
        defaultTokens={defaultTokens}
        onError={onError}
      />
    );

    fireEvent.click(screen.getByTestId('ockTokenChip_Button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes modal when clicking outside', () => {
    render(
      <TokenPicker
        pickedToken={defaultToken}
        onTokenPicked={onTokenPicked}
        defaultTokens={defaultTokens}
        onError={onError}
      />
    );

    fireEvent.click(screen.getByTestId('ockTokenChip_Button'));
    fireEvent.click(screen.getByTestId('ockModalOverlay'));
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes modal when clicking close button', () => {
    render(
      <TokenPicker
        pickedToken={defaultToken}
        onTokenPicked={onTokenPicked}
        defaultTokens={defaultTokens}
        onError={onError}
      />
    );

    fireEvent.click(screen.getByTestId('ockTokenChip_Button'));
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays default tokens as chips', () => {
    render(
      <TokenPicker
        pickedToken={defaultToken}
        onTokenPicked={onTokenPicked}
        defaultTokens={defaultTokens}
        onError={onError}
      />
    );

    fireEvent.click(screen.getByTestId('ockTokenChip_Button'));
    
    defaultTokens.forEach((token) => {
      expect(screen.getByTestId(`ockTokenChip_${token.address}`)).toBeInTheDocument();
    });
  });

  it('searches for tokens and displays results', async () => {
    render(
      <TokenPicker
        pickedToken={defaultToken}
        onTokenPicked={onTokenPicked}
        defaultTokens={defaultTokens}
        onError={onError}
      />
    );

    fireEvent.click(screen.getByTestId('ockTokenChip_Button'));
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'eth' } });

    await waitFor(() => {
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });
  });

  it('handles token selection', async () => {
    render(
      <TokenPicker
        pickedToken={defaultToken}
        onTokenPicked={onTokenPicked}
        defaultTokens={defaultTokens}
        onError={onError}
      />
    );

    fireEvent.click(screen.getByTestId('ockTokenChip_Button'));
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'eth' } });

    await waitFor(() => {
      const tokenRow = screen.getByTestId('ockTokenRow_Container');
      fireEvent.click(tokenRow);
    });

    expect(onTokenPicked).toHaveBeenCalledWith(expect.objectContaining({
      symbol: 'ETH',
      address: '0x123'
    }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    const scrollIntoViewMock = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    render(
      <TokenPicker
        pickedToken={defaultToken}
        onTokenPicked={onTokenPicked}
        defaultTokens={defaultTokens}
        onError={onError}
      />
    );

    fireEvent.click(screen.getByTestId('ockTokenChip_Button'));
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'eth' } });

    await waitFor(() => {
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });

    // Test arrow down navigation
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    
    // Find the specific token row for Ethereum
    const tokenRows = screen.getAllByTestId('ockTokenRow_Container');
    const ethereumRow = tokenRows.find(row => row.textContent?.includes('Ethereum'));
    expect(ethereumRow).toBeDefined();
    expect(ethereumRow).toHaveClass('border-2');

    // Verify scrollIntoView was called with correct options
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'nearest'
    });

    // Test selection with Enter
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onTokenPicked).toHaveBeenCalledWith(expect.objectContaining({
      symbol: 'ETH',
      address: '0x123'
    }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('handles API errors', async () => {
    const mockGetTokens = vi.fn().mockRejectedValue(new Error('API Error'));
    vi.mocked(getTokens).mockImplementation(mockGetTokens);

    render(
      <TokenPicker
        pickedToken={defaultToken}
        onTokenPicked={onTokenPicked}
        defaultTokens={defaultTokens}
        onError={onError}
      />
    );

    fireEvent.click(screen.getByTestId('ockTokenChip_Button'));
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'eth' } });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
}); 