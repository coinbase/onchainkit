import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConnectWallet } from './ConnectWallet';
import { Wallet } from './Wallet';
import { WalletBasic } from './WalletBasic';
import { WalletDropdown } from './WalletDropdown';
import { type WalletProviderReact, useWalletContext } from './WalletProvider';
import { useOutsideClick } from '../../ui/react/internal/hooks/useOutsideClick';

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: WalletProviderReact) => <>{children}</>,
}));

vi.mock('./ConnectWallet', () => ({
  ConnectWallet: () => <div data-testid="connect-wallet">Connect Wallet</div>,
}));

vi.mock('./WalletDropdown', () => ({
  WalletDropdown: () => (
    <div data-testid="wallet-dropdown">Wallet Dropdown</div>
  ),
}));

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('../../ui/react/internal/hooks/useOutsideClick', () => ({
  useOutsideClick: vi.fn(),
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
        <WalletBasic>
          <ConnectWallet />
          <WalletDropdown>
            <div>Wallet Dropdown</div>
          </WalletDropdown>
        </WalletBasic>
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
        <WalletBasic>
          <ConnectWallet />
          <WalletDropdown>
            <div>Wallet Dropdown</div>
          </WalletDropdown>
        </WalletBasic>
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
        <WalletBasic>
          <ConnectWallet />
          <WalletDropdown>
            <div>Wallet Dropdown</div>
          </WalletDropdown>
        </WalletBasic>
      </Wallet>,
    );

    expect(screen.queryByTestId('wallet-dropdown')).toBeNull();

    mockOutsideClickCallback({} as MouseEvent);

    expect(mockHandleClose).not.toHaveBeenCalled();
  });
});
