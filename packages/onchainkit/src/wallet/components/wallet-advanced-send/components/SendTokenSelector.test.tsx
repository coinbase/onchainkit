import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSendContext } from './SendProvider';
import { SendTokenSelector } from './SendTokenSelector';
import { usePortfolio } from '@/wallet/hooks/usePortfolio';
import { useAccount } from 'wagmi';

// Mock the context hook
vi.mock('../../WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

vi.mock('./SendProvider', () => ({
  useSendContext: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('@/wallet/hooks/usePortfolio', () => ({
  usePortfolio: vi.fn(),
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

const defaultContext = {
  selectedToken: null,
  handleTokenSelection: vi.fn(),
  handleResetTokenSelection: vi.fn(),
  setSelectedInputType: vi.fn(),
  handleCryptoAmountChange: vi.fn(),
  handleFiatAmountChange: vi.fn(),
};

describe('SendTokenSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
    });
    (usePortfolio as Mock).mockReturnValue({
      data: {
        tokenBalances: mockTokenBalances,
      },
    });
    (useSendContext as Mock).mockReturnValue(defaultContext);
  });

  it('renders token selection list when no token is selected', () => {
    render(<SendTokenSelector />);

    expect(screen.getByText('Select a token')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(
      mockTokenBalances.length,
    );
  });

  it('calls handleTokenSelection when a token is clicked from the list', () => {
    render(<SendTokenSelector />);

    fireEvent.click(screen.getAllByTestId('ockTokenBalanceButton')[0]);
    expect(defaultContext.handleTokenSelection).toHaveBeenCalledWith(
      mockTokenBalances[0],
    );
  });

  it('renders selected token with max button when token is selected', () => {
    (useSendContext as Mock).mockReturnValue({
      ...defaultContext,
      selectedToken: mockTokenBalances[0],
    });

    render(<SendTokenSelector />);

    expect(screen.getByText('Test Token')).toBeInTheDocument();
    expect(screen.getByText(/0\.000 TEST available/)).toBeInTheDocument();
  });

  it('handles max button click correctly', () => {
    (useSendContext as Mock).mockReturnValue({
      ...defaultContext,
      selectedToken: mockTokenBalances[0],
    });

    render(<SendTokenSelector />);

    const maxButton = screen.getByRole('button', { name: 'Max' });
    fireEvent.click(maxButton);

    expect(defaultContext.setSelectedInputType).toHaveBeenCalledWith('crypto');
    expect(defaultContext.handleFiatAmountChange).toHaveBeenCalledWith('100');
    expect(defaultContext.handleCryptoAmountChange).toHaveBeenCalledWith(
      '0.000000001',
    );
  });

  it('calls handleResetTokenSelection when selected token is clicked', () => {
    (useSendContext as Mock).mockReturnValue({
      ...defaultContext,
      selectedToken: mockTokenBalances[0],
    });

    render(<SendTokenSelector />);

    fireEvent.click(screen.getByTestId('ockTokenBalanceButton'));
    expect(defaultContext.handleResetTokenSelection).toHaveBeenCalled();
  });

  it('handles empty tokenBalances gracefully', () => {
    (usePortfolio as Mock).mockReturnValue({
      data: {
        tokenBalances: [],
      },
    });

    render(<SendTokenSelector />);
    expect(screen.getByText('Select a token')).toBeInTheDocument();
  });

  it('applies custom classNames when provided', () => {
    const customClassNames = {
      container: 'custom-button',
    };

    const { rerender } = render(
      <SendTokenSelector classNames={customClassNames} />,
    );
    const buttons = screen.getAllByTestId('ockTokenBalanceButton');
    expect(buttons[0]).toHaveClass(customClassNames.container);
    expect(buttons[1]).toHaveClass(customClassNames.container);

    (useSendContext as Mock).mockReturnValue({
      ...defaultContext,
      selectedToken: mockTokenBalances[0],
    });

    rerender(<SendTokenSelector classNames={customClassNames} />);
    const button = screen.getByTestId('ockTokenBalanceButton');
    expect(button).toHaveClass(customClassNames.container);
  });
});
