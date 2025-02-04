import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalletAdvancedContext } from '../../WalletAdvancedProvider';
import { SendTokenSelector } from './SendTokenSelector';

// Mock the context hook
vi.mock('../../WalletAdvancedProvider', () => ({
  useWalletAdvancedContext: vi.fn(),
}));

const mockTokenBalances: PortfolioTokenWithFiatValue[] = [
  {
    address: '0x1230000000000000000000000000000000000000',
    symbol: 'TEST',
    name: 'Test Token',
    decimals: 18,
    cryptoBalance: 1000000000,
    fiatBalance: 100,
    image: 'test.png',
    chainId: 8453,
  },
  {
    address: '0x4560000000000000000000000000000000000000',
    symbol: 'TEST2',
    name: 'Test Token 2',
    decimals: 18,
    cryptoBalance: 2000000000000,
    fiatBalance: 200,
    image: 'test2.png',
    chainId: 8453,
  },
];

describe('SendTokenSelector', () => {
  const defaultProps = {
    selectedToken: null,
    handleTokenSelection: vi.fn(),
    handleResetTokenSelection: vi.fn(),
    setSelectedInputType: vi.fn(),
    handleCryptoAmountChange: vi.fn(),
    handleFiatAmountChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useWalletAdvancedContext as Mock).mockReturnValue({
      tokenBalances: mockTokenBalances,
    });
  });

  it('renders token selection list when no token is selected', () => {
    render(<SendTokenSelector {...defaultProps} />);

    expect(screen.getByText('Select a token')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(
      mockTokenBalances.length,
    );
  });

  it('calls handleTokenSelection when a token is clicked from the list', () => {
    render(<SendTokenSelector {...defaultProps} />);

    fireEvent.click(screen.getAllByTestId('ockTokenBalanceButton')[0]);
    expect(defaultProps.handleTokenSelection).toHaveBeenCalledWith(
      mockTokenBalances[0],
    );
  });

  it('renders selected token with max button when token is selected', () => {
    render(
      <SendTokenSelector
        {...defaultProps}
        selectedToken={mockTokenBalances[0]}
      />,
    );

    expect(screen.getByText('Test Token')).toBeInTheDocument();
    expect(screen.getByText(/0\.000 TEST available/)).toBeInTheDocument();
  });

  it('handles max button click correctly', () => {
    render(
      <SendTokenSelector
        {...defaultProps}
        selectedToken={mockTokenBalances[0]}
      />,
    );

    const maxButton = screen.getByRole('button', { name: 'Use max' });
    fireEvent.click(maxButton);

    expect(defaultProps.setSelectedInputType).toHaveBeenCalledWith('crypto');
    expect(defaultProps.handleFiatAmountChange).toHaveBeenCalledWith('100');
    expect(defaultProps.handleCryptoAmountChange).toHaveBeenCalledWith(
      '0.000000001',
    );
  });

  it('calls handleResetTokenSelection when selected token is clicked', () => {
    render(
      <SendTokenSelector
        {...defaultProps}
        selectedToken={mockTokenBalances[0]}
      />,
    );

    fireEvent.click(screen.getByTestId('ockTokenBalanceButton'));
    expect(defaultProps.handleResetTokenSelection).toHaveBeenCalled();
  });

  it('handles empty tokenBalances gracefully', () => {
    (useWalletAdvancedContext as Mock).mockReturnValue({
      tokenBalances: [],
    });

    render(<SendTokenSelector {...defaultProps} />);
    expect(screen.getByText('Select a token')).toBeInTheDocument();
  });

  it('applies custom classNames when provided', () => {
    const customClassNames = {
      container: 'custom-button',
    };

    const { rerender } = render(
      <SendTokenSelector {...defaultProps} classNames={customClassNames} />,
    );
    const buttons = screen.getAllByTestId('ockTokenBalanceButton');
    expect(buttons[0]).toHaveClass(customClassNames.container);
    expect(buttons[1]).toHaveClass(customClassNames.container);

    rerender(
      <SendTokenSelector
        {...defaultProps}
        selectedToken={mockTokenBalances[0]}
        classNames={customClassNames}
      />,
    );
    const button = screen.getByTestId('ockTokenBalanceButton');
    expect(button).toHaveClass(customClassNames.container);
  });
});
