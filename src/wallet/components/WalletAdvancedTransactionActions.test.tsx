import { useOnchainKit } from '@/useOnchainKit';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { WalletAdvancedTransactionActions } from './WalletAdvancedTransactionActions';
import { useWalletContext } from './WalletProvider';

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('./WalletAdvancedProvider', () => ({
  useWalletAdvancedContext: vi.fn(),
  WalletAdvancedProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

describe('WalletAdvancedTransactionActons', () => {
  const mockUseWalletAdvancedContext = useWalletAdvancedContext as ReturnType<
    typeof vi.fn
  >;

  const mockUseOnchainKit = useOnchainKit as ReturnType<typeof vi.fn>;

  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;

  const defaultMockUseWalletAdvancedContext = {
    setShowSwap: vi.fn(),
    animations: {
      content: '',
    },
  };

  const mockProjectId = '123-ABC';
  const mockAddress = '0x123';
  const mockChain = { name: 'Base' };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'open').mockImplementation(() => null);
    mockUseWalletAdvancedContext.mockReturnValue(
      defaultMockUseWalletAdvancedContext,
    );
    mockUseOnchainKit.mockReturnValue({
      projectId: mockProjectId,
    });

    mockUseWalletContext.mockReturnValue({
      address: mockAddress,
      chain: mockChain,
    });
  });

  it('renders the WalletAdvancedTransactionActions component', () => {
    render(<WalletAdvancedTransactionActions />);

    const buyButton = screen.getByRole('button', { name: 'Buy' });
    const sendButton = screen.getByRole('button', { name: 'Send' });
    const swapButton = screen.getByRole('button', { name: 'Swap' });

    expect(buyButton).toBeDefined();
    expect(sendButton).toBeDefined();
    expect(swapButton).toBeDefined();
  });

  it('opens the buy page when the buy button is clicked and projectId, address and chain.name are defined', () => {
    render(<WalletAdvancedTransactionActions />);

    const buyButton = screen.getByRole('button', { name: 'Buy' });
    fireEvent.click(buyButton);

    const urlString = vi.mocked(window.open).mock.calls[0][0] as string;
    const url = new URL(urlString);
    const params = Object.fromEntries(url.searchParams);

    expect(url.origin + url.pathname).toBe(
      'https://pay.coinbase.com/buy/select-asset',
    );
    expect(params).toEqual({
      appId: mockProjectId,
      destinationWallets: JSON.stringify([
        {
          address: mockAddress,
          blockchains: [mockChain.name.toLowerCase()],
        },
      ]),
      defaultAsset: 'USDC',
      defaultPaymentMethod: 'CRYPTO_ACCOUNT',
      presetFiatAmount: '25',
    });
    expect(vi.mocked(window.open).mock.calls[0][1]).toBe('popup');
    expect(vi.mocked(window.open).mock.calls[0][2]).toBe(
      'width=400,height=600,scrollbars=yes',
    );
  });

  it('opens the buy page when the buy button is clicked and projectId, address or chain.name are not defined', () => {
    // projectId is not defined
    mockUseOnchainKit.mockReturnValue({
      projectId: null,
    });
    const { rerender } = render(<WalletAdvancedTransactionActions />);
    const buyButton = screen.getByRole('button', { name: 'Buy' });
    fireEvent.click(buyButton);
    expect(window.open).not.toHaveBeenCalled();

    // address is not defined
    mockUseOnchainKit.mockReturnValue({
      projectId: mockProjectId,
    });
    mockUseWalletContext.mockReturnValue({
      address: null,
      chain: mockChain,
    });
    rerender(<WalletAdvancedTransactionActions />);
    fireEvent.click(buyButton);
    expect(window.open).not.toHaveBeenCalled();

    // chain.name is not defined
    mockUseWalletContext.mockReturnValue({
      address: mockAddress,
      chain: null,
    });
    rerender(<WalletAdvancedTransactionActions />);
    fireEvent.click(buyButton);
    expect(window.open).not.toHaveBeenCalled();
  });

  it('opens the send page when the send button is clicked', () => {
    render(<WalletAdvancedTransactionActions />);

    const sendButton = screen.getByRole('button', { name: 'Send' });
    fireEvent.click(sendButton);

    expect(window.open).toHaveBeenCalledWith(
      'https://wallet.coinbase.com',
      '_blank',
    );
  });

  it('sets showSwap to true when the swap button is clicked', () => {
    const setShowSwapMock = vi.fn();

    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      setShowSwap: setShowSwapMock,
    });

    render(<WalletAdvancedTransactionActions />);

    const swapButton = screen.getByRole('button', { name: 'Swap' });
    fireEvent.click(swapButton);

    expect(setShowSwapMock).toHaveBeenCalledWith(true);
  });

  it('renders a placeholder when fetcher is loading', () => {
    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      isFetchingPortfolioData: true,
    });

    render(<WalletAdvancedTransactionActions />);

    const placeholder = screen.getByTestId(
      'ockWalletAdvanced_LoadingPlaceholder',
    );
    expect(placeholder).toHaveClass('my-3 h-16 w-80');
  });

  it('applies custom classNames when provided', () => {
    const customClassNames = {
      container: 'custom-container',
      leftAction: {
        container: 'custom-left-button',
        icon: 'custom-left-icon',
        label: 'custom-left-label',
      },
      middleAction: {
        container: 'custom-middle-button',
        icon: 'custom-middle-icon',
        label: 'custom-middle-label',
      },
      rightAction: {
        container: 'custom-right-button',
        icon: 'custom-right-icon',
        label: 'custom-right-label',
      },
    };

    render(<WalletAdvancedTransactionActions classNames={customClassNames} />);

    // Check main container
    const container = screen.getByTestId(
      'ockWalletAdvanced_TransactionActions',
    );
    expect(container.className).toContain('custom-container');

    // Check Buy button (left action)
    const buyButton = screen.getByRole('button', { name: 'Buy' });
    expect(buyButton.className).toContain('custom-left-button');
    expect(buyButton.querySelector('span:first-child')?.className).toContain(
      'custom-left-icon',
    );
    expect(buyButton.querySelector('span:last-child')?.className).toContain(
      'custom-left-label',
    );

    // Check Send button (middle action)
    const sendButton = screen.getByRole('button', { name: 'Send' });
    expect(sendButton.className).toContain('custom-middle-button');
    expect(sendButton.querySelector('span:first-child')?.className).toContain(
      'custom-middle-icon',
    );
    expect(sendButton.querySelector('span:last-child')?.className).toContain(
      'custom-middle-label',
    );

    // Check Swap button (right action)
    const swapButton = screen.getByRole('button', { name: 'Swap' });
    expect(swapButton.className).toContain('custom-right-button');
    expect(swapButton.querySelector('span:first-child')?.className).toContain(
      'custom-right-icon',
    );
    expect(swapButton.querySelector('span:last-child')?.className).toContain(
      'custom-right-label',
    );
  });
});
