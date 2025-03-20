import { useOutsideClick } from '@/internal/hooks/useOutsideClick';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConnectWallet } from './ConnectWallet';
import { Wallet } from './Wallet';
import { WalletAdvanced } from './WalletAdvanced';
import { WalletDropdown } from './WalletDropdown';
import { type WalletProviderReact, useWalletContext } from './WalletProvider';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('@/internal/hooks/useOutsideClick', () => ({
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

vi.mock('./WalletAdvanced', () => ({
  WalletAdvanced: () => (
    <div data-testid="wallet-advanced">Wallet Advanced</div>
  ),
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
      isSubComponentOpen: true,
      handleClose: mockHandleClose,
      containerRef: { current: document.createElement('div') },
      connectRef: { current: document.createElement('div') },
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    vi.clearAllMocks();
  });

  it('should render the Wallet component with ConnectWallet', () => {
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isSubComponentOpen: false,
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
      isSubComponentOpen: true,
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
      isSubComponentOpen: false,
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

  it('should log error and default to WalletDropdown when both WalletDropdown and WalletAdvanced are provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Wallet>
        <ConnectWallet />
        <WalletDropdown>
          <div>Wallet Dropdown</div>
        </WalletDropdown>
        <WalletAdvanced>
          <div>Wallet Advanced</div>
        </WalletAdvanced>
      </Wallet>,
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Defaulted to WalletDropdown. Wallet cannot have both WalletDropdown and WalletAdvanced as children.',
    );
    expect(screen.getByTestId('wallet-dropdown')).toBeDefined();
    expect(screen.queryByTestId('wallet-advanced')).toBeNull();

    consoleSpy.mockRestore();
  });

  it('should render WalletAdvanced when WalletAdvanced is provided', () => {
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isSubComponentOpen: true,
      handleClose: mockHandleClose,
      containerRef: { current: document.createElement('div') },
    });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletAdvanced>
          <div>Wallet Advanced</div>
        </WalletAdvanced>
      </Wallet>,
    );

    expect(screen.getByTestId('wallet-advanced')).toBeDefined();
    expect(screen.queryByTestId('wallet-dropdown')).toBeNull();
  });

  it('should render Draggable when draggable prop is true', () => {
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isSubComponentOpen: true,
      handleClose: mockHandleClose,
      containerRef: { current: document.createElement('div') },
    });

    render(
      <Wallet draggable={true}>
        <ConnectWallet />
        <WalletAdvanced>
          <div>Wallet Advanced</div>
        </WalletAdvanced>
      </Wallet>,
    );

    expect(screen.getByTestId('ockDraggable')).toBeDefined();
  });

  it('should disable Draggable dragging when isConnectModalOpen or breakpoint is sm and isSubComponentOpen is true', () => {
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isSubComponentOpen: true,
      handleClose: mockHandleClose,
      containerRef: { current: document.createElement('div') },
      breakpoint: 'sm',
    });

    render(
      <Wallet draggable={true}>
        <ConnectWallet />
        <WalletAdvanced>
          <div>Wallet Advanced</div>
        </WalletAdvanced>
      </Wallet>,
    );

    expect(screen.getByTestId('ockDraggable')).toBeDefined();
  });

  it('should render WalletAdvanced right-aligned when there is not enough space on the right', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isSubComponentOpen: true,
      alignSubComponentRight: true,
    });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletAdvanced>
          <div>Wallet Advanced</div>
        </WalletAdvanced>
      </Wallet>,
    );

    expect(screen.getByTestId('ockWalletAdvancedContainer')).toHaveClass(
      'right-0',
    );
  });

  it('should render WalletAdvanced left-aligned when there is enough space on the right', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isSubComponentOpen: true,
    });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletAdvanced>
          <div>Wallet Advanced</div>
        </WalletAdvanced>
      </Wallet>,
    );

    expect(screen.getByTestId('ockWalletAdvancedContainer')).toHaveClass(
      'left-0',
    );
  });

  it('should render WalletAdvanced above ConnectWallet when there is not enough space on the bottom', () => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isSubComponentOpen: true,
      showSubComponentAbove: true,
    });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletAdvanced>
          <div>Wallet Advanced</div>
        </WalletAdvanced>
      </Wallet>,
    );

    expect(screen.getByTestId('ockWalletAdvancedContainer')).toHaveClass(
      'bottom-full',
    );
  });

  it('should render WalletAdvanced below ConnectWallet when there is enough space on the bottom', () => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isSubComponentOpen: true,
    });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletAdvanced>
          <div>Wallet Advanced</div>
        </WalletAdvanced>
      </Wallet>,
    );

    expect(screen.getByTestId('ockWalletAdvancedContainer')).toHaveClass(
      'top-full',
    );
  });
});
