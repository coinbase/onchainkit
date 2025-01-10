import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalletIslandContext } from './WalletIslandProvider';
import { WalletIslandTransactionActions } from './WalletIslandTransactionActions';
import { useOnchainKit } from '@/core-react/useOnchainKit';
import { useWalletContext } from '@/wallet/components/WalletProvider';

vi.mock('@/core-react/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('./WalletIslandProvider', () => ({
  useWalletIslandContext: vi.fn(),
  WalletIslandProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

describe('WalletIslandTransactionActons', () => {
  const mockUseWalletIslandContext = useWalletIslandContext as ReturnType<
    typeof vi.fn
  >;

  const mockUseOnchainKit = useOnchainKit as ReturnType<typeof vi.fn>;

  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;

  const defaultMockUseWalletIslandContext = {
    setShowSwap: vi.fn(),
    animations: {
      content: '',
    },
  };

  const mockProjectId = '123';
  const mockAddress = '0x123';
  const mockChain = { name: 'Base' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'open').mockImplementation(() => null);
    mockUseWalletIslandContext.mockReturnValue(
      defaultMockUseWalletIslandContext,
    );
    mockUseOnchainKit.mockReturnValue({
      projectId: mockProjectId,
      chain: mockChain,
    });

    mockUseWalletContext.mockReturnValue({
      address: mockAddress,
    });
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

    expect(window.open).toHaveBeenCalledWith(
      `https://pay.coinbase.com/buy/select-asset?appId=${mockProjectId}&destinationWallets=[{"address": "${mockAddress}", "blockchains":["${mockChain.name.toLowerCase()}"]}]&defaultAsset=USDC&defaultPaymentMethod=CRYPTO_ACCOUNT&presetFiatAmount=25`,
      'popup',
      'width=400,height=600,scrollbars=yes',
    );
  });

  it('opens the send page when the send button is clicked', () => {
    render(<WalletIslandTransactionActions />);

    const sendButton = screen.getByRole('button', { name: 'Send' });
    fireEvent.click(sendButton);

    expect(window.open).toHaveBeenCalledWith(
      'https://wallet.coinbase.com',
      '_blank',
    );
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

  it('renders a placeholder when fetcher is loading', () => {
    mockUseWalletIslandContext.mockReturnValue({
      ...defaultMockUseWalletIslandContext,
      isFetchingPortfolioData: true,
    });

    render(<WalletIslandTransactionActions />);

    const placeholder = screen.getByTestId(
      'ockWalletIsland_LoadingPlaceholder',
    );
    expect(placeholder).toHaveClass('my-3 h-16 w-full');
  });
});
