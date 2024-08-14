import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConnectWallet } from './ConnectWallet';
import { WalletWithMobileDrawer } from './WalletWithMobileDrawer';
import { WalletMenu } from './WalletMenu';
import { useWalletContext } from './WalletProvider';
import { useAccount } from 'wagmi';
import useBreakpoints from '../../useBreakpoints';

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

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('../../useBreakpoints', () => ({
  default: vi.fn(),
}));

const useAccountMock = useAccount as vi.Mock;
const useBreakpointsMock = useBreakpoints as vi.Mock;

describe('WalletWithMobileDrawer Component', () => {
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
      <WalletWithMobileDrawer>
        <ConnectWallet />
        <WalletMenu />
      </WalletWithMobileDrawer>,
    );

    expect(screen.getByTestId('connect-wallet')).toBeDefined();
    expect(screen.queryByTestId('wallet-dropdown')).toBeNull();
  });

  it('should close the wallet when clicking outside', () => {
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: true,
      setIsOpen: mockSetIsOpen,
    });

    useAccountMock.mockReturnValue({ address: '123' });
    useBreakpointsMock.mockReturnValue('sm');

    render(
      <WalletWithMobileDrawer>
        <ConnectWallet />
        <WalletMenu />
      </WalletWithMobileDrawer>,
    );

    expect(screen.getByTestId('ockWalletBottomSheet')).toBeDefined();

    fireEvent.click(document.body);

    expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  });

  it('should not close the wallet when clicking inside', () => {
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: true,
      setIsOpen: mockSetIsOpen,
    });

    useAccountMock.mockReturnValue({ address: '123' });
    useBreakpointsMock.mockReturnValue('sm');

    render(
      <WalletWithMobileDrawer>
        <ConnectWallet />
        <WalletMenu />
      </WalletWithMobileDrawer>,
    );

    const walletMenu = screen.getByTestId('ockWalletBottomSheet');
    expect(walletMenu).toBeDefined();

    fireEvent.click(walletMenu);

    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });

  it('should not trigger click handler when wallet is closed', () => {
    render(
      <WalletWithMobileDrawer>
        <ConnectWallet />
        <WalletMenu />
      </WalletWithMobileDrawer>,
    );

    expect(screen.queryByTestId('wallet-dropdown')).toBeNull();

    fireEvent.click(document.body);

    expect(mockSetIsOpen).not.toHaveBeenCalled();
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = render(
      <WalletWithMobileDrawer>
        <ConnectWallet />
        <WalletMenu />
      </WalletWithMobileDrawer>,
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );
  });
});
