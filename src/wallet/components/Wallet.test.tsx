import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useOutsideClick } from '../../ui/react/internal/hooks/useOutsideClick';
import { ConnectWallet } from './ConnectWallet';
import { Wallet } from './Wallet';
import { WalletDropdown } from './WalletDropdown';
import { WalletIsland } from './WalletIsland';
import { type WalletProviderReact, useWalletContext } from './WalletProvider';

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('../../ui/react/internal/hooks/useOutsideClick', () => ({
  useOutsideClick: vi.fn(),
}));

vi.mock('./ConnectWallet', () => ({
  ConnectWallet: () => <div data-testid="connect-wallet">Connect Wallet</div>,
}));

vi.mock('./WalletDropdown', () => ({
  WalletDropdown: () => (
    <div data-testid="wallet-dropdown">Wallet Dropdown</div>
  ),
}));

vi.mock('./WalletIsland', () => ({
  WalletIsland: () => <div data-testid="wallet-island">Wallet Island</div>,
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: WalletProviderReact) => <>{children}</>,
}));

describe('Wallet Component', () => {
  let mockHandleClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockHandleClose = vi.fn();
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: true,
      handleClose: mockHandleClose,
      containerRef: { current: document.createElement('div') },
    });

    vi.clearAllMocks();
  });

  it('should render the Wallet component with ConnectWallet', () => {
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: false,
      handleClose: mockHandleClose,
      containerRef: { current: document.createElement('div') },
    });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletDropdown>
          <div>Wallet Dropdown</div>
        </WalletDropdown>
      </Wallet>,
    );

    expect(screen.getByTestId('connect-wallet')).toBeDefined();
    expect(screen.queryByTestId('wallet-dropdown')).toBeNull();
  });

  it('should close the wallet when clicking outside', () => {
    const container = document.createElement('div');
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: true,
      handleClose: mockHandleClose,
      containerRef: { current: container },
    });

    const mockOutsideClickCallback = vi.fn();
    (useOutsideClick as ReturnType<typeof vi.fn>).mockReturnValue({
      handleOutsideClick: mockOutsideClickCallback,
    });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletDropdown>
          <div>Wallet Dropdown</div>
        </WalletDropdown>
      </Wallet>,
    );

    expect(screen.getByTestId('wallet-dropdown')).toBeDefined();

    mockOutsideClickCallback({} as MouseEvent);

    expect(mockOutsideClickCallback).toHaveBeenCalled();
  });

  it('should not trigger click handler when wallet is closed', () => {
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: false,
      handleClose: mockHandleClose,
      containerRef: { current: document.createElement('div') },
    });

    const mockOutsideClickCallback = vi.fn();
    (useOutsideClick as ReturnType<typeof vi.fn>).mockReturnValue({
      handleOutsideClick: mockOutsideClickCallback,
    });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletDropdown>
          <div>Wallet Dropdown</div>
        </WalletDropdown>
      </Wallet>,
    );

    expect(screen.queryByTestId('wallet-dropdown')).toBeNull();

    mockOutsideClickCallback({} as MouseEvent);

    expect(mockHandleClose).not.toHaveBeenCalled();
  });

  it('should log error and default to WalletDropdown when both WalletDropdown and WalletIsland are provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Wallet>
        <ConnectWallet />
        <WalletDropdown>
          <div>Wallet Dropdown</div>
        </WalletDropdown>
        <WalletIsland>
          <div>Wallet Island</div>
        </WalletIsland>
      </Wallet>,
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Defaulted to WalletDropdown. Wallet cannot have both WalletDropdown and WalletIsland as children.',
    );
    expect(screen.getByTestId('wallet-dropdown')).toBeDefined();
    expect(screen.queryByTestId('wallet-island')).toBeNull();

    consoleSpy.mockRestore();
  });
});
