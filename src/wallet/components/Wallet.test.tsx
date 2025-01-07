import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

  it('should render WalletIsland when WalletIsland is provided', () => {
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: true,
      handleClose: mockHandleClose,
      containerRef: { current: document.createElement('div') },
    });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletIsland>
          <div>Wallet Island</div>
        </WalletIsland>
      </Wallet>,
    );

    expect(screen.getByTestId('wallet-island')).toBeDefined();
    expect(screen.queryByTestId('wallet-dropdown')).toBeNull();
  });

  it('should render Draggable when draggable prop is true', () => {
    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: true,
      handleClose: mockHandleClose,
      containerRef: { current: document.createElement('div') },
    });

    render(
      <Wallet draggable={true}>
        <ConnectWallet />
        <WalletIsland>
          <div>Wallet Island</div>
        </WalletIsland>
      </Wallet>,
    );

    expect(screen.getByTestId('ockDraggable')).toBeDefined();
  });

  it('should render WalletIsland right-aligned when there is not enough space on the right', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: true,
    });

    const mockGetBoundingClientRect = vi.fn().mockReturnValue({
      left: 400,
      right: 450,
      bottom: 100,
      top: 0,
      width: 50,
      height: 100,
    });

    // Mock Element.prototype.getBoundingClientRect called on the ConnectWallet ref
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    render(
      <Wallet>
        <ConnectWallet />
        <WalletIsland>
          <div>Wallet Island</div>
        </WalletIsland>
      </Wallet>,
    );

    expect(screen.getByTestId('ockWalletIslandContainer')).toHaveClass(
      'right-0',
    );

    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('should render WalletIsland left-aligned when there is enough space on the right', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: true,
    });

    const mockGetBoundingClientRect = vi.fn().mockReturnValue({
      left: 400,
      right: 450,
      bottom: 100,
      top: 0,
      width: 50,
      height: 100,
    });

    // Mock Element.prototype.getBoundingClientRect called on the ConnectWallet ref
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    render(
      <Wallet>
        <ConnectWallet />
        <WalletIsland>
          <div>Wallet Island</div>
        </WalletIsland>
      </Wallet>,
    );

    expect(screen.getByTestId('ockWalletIslandContainer')).toHaveClass(
      'left-0',
    );
  });

  it('should render WalletIsland above ConnectWallet when there is not enough space on the bottom', () => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: true,
    });

    const mockGetBoundingClientRect = vi.fn().mockReturnValue({
      left: 400,
      right: 450,
      bottom: 100,
      top: 0,
      width: 50,
      height: 100,
    });

    // Mock Element.prototype.getBoundingClientRect called on the ConnectWallet ref
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    render(
      <Wallet>
        <ConnectWallet />
        <WalletIsland>
          <div>Wallet Island</div>
        </WalletIsland>
      </Wallet>,
    );

    expect(screen.getByTestId('ockWalletIslandContainer')).toHaveClass(
      'top-full',
    );
  });

  it('should render WalletIsland above ConnectWallet when there is not enough space on the bottom', () => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    (useWalletContext as ReturnType<typeof vi.fn>).mockReturnValue({
      isOpen: true,
    });

    const mockGetBoundingClientRect = vi.fn().mockReturnValue({
      left: 400,
      right: 450,
      bottom: 800,
      top: 0,
      width: 50,
      height: 100,
    });

    // Mock Element.prototype.getBoundingClientRect called on the ConnectWallet ref
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    render(
      <Wallet>
        <ConnectWallet />
        <WalletIsland>
          <div>Wallet Island</div>
        </WalletIsland>
      </Wallet>,
    );

    expect(screen.getByTestId('ockWalletIslandContainer')).toHaveClass(
      'bottom-full',
    );
  });
});
