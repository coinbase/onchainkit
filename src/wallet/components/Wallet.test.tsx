import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConnectWallet } from './ConnectWallet';
import { Wallet } from './Wallet';
import { WalletDropdown } from './WalletDropdown';
import { useWalletContext } from './WalletProvider';

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }) => <>{children}</>,
}));

vi.mock('./ConnectWallet', () => ({
  ConnectWallet: () => <div data-testid="connect-wallet">Connect Wallet</div>,
}));

vi.mock('./WalletDropdown', () => ({
  WalletDropdown: () => (
    <div data-testid="wallet-dropdown">Wallet Dropdown</div>
  ),
}));

vi.mock('../../useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('Wallet Component', () => {
  let mockSetIsOpen: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSetIsOpen = vi.fn();
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: false,
      setIsOpen: mockSetIsOpen,
    });
  });

  it('should render the Wallet component with ConnectWallet', () => {
    render(
      <Wallet>
        <ConnectWallet />
        <WalletDropdown />
      </Wallet>,
    );

    expect(screen.getByTestId('connect-wallet')).toBeDefined();
    expect(screen.queryByTestId('wallet-dropdown')).toBeNull();
  });

  it('should close the wallet when clicking outside', () => {
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: true,
      setIsOpen: mockSetIsOpen,
    });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletDropdown />
      </Wallet>,
    );

    expect(screen.getByTestId('wallet-dropdown')).toBeDefined();

    fireEvent.click(document.body);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('should not close the wallet when clicking inside', () => {
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: true,
      setIsOpen: mockSetIsOpen,
    });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletDropdown />
      </Wallet>,
    );

    const walletDropdown = screen.getByTestId('wallet-dropdown');
    expect(walletDropdown).toBeDefined();

    fireEvent.click(walletDropdown);

    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });

  it('should not trigger click handler when wallet is closed', () => {
    render(
      <Wallet>
        <ConnectWallet />
        <WalletDropdown />
      </Wallet>,
    );

    expect(screen.queryByTestId('wallet-dropdown')).toBeNull();

    fireEvent.click(document.body);

    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = render(
      <Wallet>
        <ConnectWallet />
        <WalletDropdown />
      </Wallet>,
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );
  });
});
