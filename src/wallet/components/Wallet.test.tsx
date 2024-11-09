import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useClickOutside } from '../../useClickOutside';
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

vi.mock('../../useClickOutside', () => ({
  useClickOutside: vi.fn(),
}));

describe('Wallet Component', () => {
  let mockSetIsOpen: ReturnType<typeof vi.fn>;
  let mockClickOutsideCallback: (e: MouseEvent) => void;

  beforeEach(() => {
    mockSetIsOpen = vi.fn();
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: true,
      setIsOpen: mockSetIsOpen,
    });

    (useClickOutside as any).mockImplementation((_, callback) => {
      mockClickOutsideCallback = callback;
    });

    vi.clearAllMocks();
  });

  it('should render the Wallet component with ConnectWallet', () => {
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: false,
      setIsOpen: mockSetIsOpen,
    });

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
    render(
      <Wallet>
        <ConnectWallet />
        <WalletDropdown />
      </Wallet>,
    );

    expect(screen.getByTestId('wallet-dropdown')).toBeDefined();

    mockClickOutsideCallback();

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('should not trigger click handler when wallet is closed', () => {
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: false,
      setIsOpen: mockSetIsOpen,
    });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletDropdown />
      </Wallet>,
    );

    expect(screen.queryByTestId('wallet-dropdown')).toBeNull();

    mockClickOutsideCallback();

    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });
});
