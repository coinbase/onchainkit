import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalletIslandContext } from './WalletIslandProvider';
import { WalletIslandTransactionActions } from './WalletIslandTransactionActions';

vi.mock('./WalletIslandProvider', () => ({
  useWalletIslandContext: vi.fn(),
  WalletIslandProvider: ({ children }) => <>{children}</>,
}));

describe('WalletIslandTransactionActons', () => {
  const mockUseWalletIslandContext = useWalletIslandContext as ReturnType<
    typeof vi.fn
  >;

  const defaultMockUseWalletIslandContext = {
    setShowSwap: vi.fn(),
    animationClasses: {
      transactionActions: 'animate-walletIslandContainerItem3',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'open').mockImplementation(() => null);
    mockUseWalletIslandContext.mockReturnValue(
      defaultMockUseWalletIslandContext,
    );
  });

  it('renders the WalletIslandTransactionActions component', () => {
    render(<WalletIslandTransactionActions />);

    const buyButton = screen.getByRole('button', { name: 'Buy' });
    const sendButton = screen.getByRole('button', { name: 'Send' });
    const swapButton = screen.getByRole('button', { name: 'Swap' });

    expect(buyButton).toBeDefined();
    expect(sendButton).toBeDefined();
    expect(swapButton).toBeDefined();
  });

  it('opens the buy page when the buy button is clicked', () => {
    render(<WalletIslandTransactionActions />);

    const buyButton = screen.getByRole('button', { name: 'Buy' });
    fireEvent.click(buyButton);

    expect(window.open).toHaveBeenCalledWith('https://pay.coinbase.com', '_blank');
  });

  it('opens the send page when the send button is clicked', () => {
    render(<WalletIslandTransactionActions />);

    const sendButton = screen.getByRole('button', { name: 'Send' });
    fireEvent.click(sendButton);

    expect(window.open).toHaveBeenCalledWith('https://wallet.coinbase.com', '_blank');
  });


  it('sets showSwap to true when the swap button is clicked', () => {
    const setShowSwapMock = vi.fn();

    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      setShowSwap: setShowSwapMock,
    });

    render(<WalletIslandTransactionActions />);

    const swapButton = screen.getByRole('button', { name: 'Swap' });
    fireEvent.click(swapButton);

    expect(setShowSwapMock).toHaveBeenCalledWith(true);
  });
});
