import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConnectWallet } from './ConnectWallet';
import { Wallet } from './Wallet';
import { WalletAdvanced } from './WalletAdvanced';
import { useWalletContext } from './WalletProvider';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('./ConnectWallet', () => ({
  ConnectWallet: () => <div data-testid="connect-wallet">Connect Wallet</div>,
}));

vi.mock('./WalletDropdownContent', () => ({
  WalletDropdownContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wallet-advanced-content">{children}</div>
  ),
}));

vi.mock('./WalletAdvancedProvider', () => ({
  useWalletAdvancedContext: vi.fn(),
  WalletAdvancedProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('./WalletAdvancedWalletActions', () => ({
  WalletAdvancedWalletActions: () => (
    <div data-testid="WalletAdvancedWalletActions">Wallet Advanced</div>
  ),
}));

vi.mock('./WalletAdvancedAddressDetails', () => ({
  WalletAdvancedAddressDetails: () => (
    <div data-testid="WalletAdvancedAddressDetails">Wallet Advanced</div>
  ),
}));

vi.mock('./WalletAdvancedTransactionActions', () => ({
  WalletAdvancedTransactionActions: () => (
    <div data-testid="WalletAdvancedTransactionActions">Wallet Advanced</div>
  ),
}));

vi.mock('./WalletAdvancedTokenHoldings', () => ({
  WalletAdvancedTokenHoldings: () => (
    <div data-testid="WalletAdvancedTokenHoldings">Wallet Advanced</div>
  ),
}));

describe('WalletAdvanced', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;

  beforeEach(() => {
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

  it('renders connect-wallet when isSubComponentOpen is false', () => {
    mockUseWalletContext.mockReturnValue({ isSubComponentOpen: false });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletAdvanced>
          <div data-testid="child-content">Some content</div>
        </WalletAdvanced>
      </Wallet>,
    );

    expect(screen.getByTestId('connect-wallet')).toBeDefined();
    expect(screen.queryByTestId('wallet-advanced-content')).toBeNull();
    expect(screen.queryByTestId('child-content')).toBeNull();
  });

  it('renders wallet-advanced-content when isSubComponentOpen is true', () => {
    mockUseWalletContext.mockReturnValue({ isSubComponentOpen: true });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletAdvanced>
          <div data-testid="child-content">Some content</div>
        </WalletAdvanced>
      </Wallet>,
    );

    expect(screen.getByTestId('wallet-advanced-content')).toBeDefined();
    expect(screen.getByTestId('child-content')).toBeDefined();
  });

  it('renders default children when no children are provided', () => {
    mockUseWalletContext.mockReturnValue({ isSubComponentOpen: true });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletAdvanced />
      </Wallet>,
    );

    expect(screen.getByTestId('WalletAdvancedWalletActions')).toBeDefined();
    expect(screen.getByTestId('WalletAdvancedAddressDetails')).toBeDefined();
  });
});
