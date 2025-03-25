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

vi.mock('./WalletAdvancedContent', () => ({
  WalletAdvancedContent: ({ children }: { children: React.ReactNode }) => (
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
});
