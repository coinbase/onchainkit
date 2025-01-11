import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConnectWallet } from './ConnectWallet';
import { Wallet } from './Wallet';
import { WalletAdvanced } from './WalletAdvanced';
import { useWalletContext } from './WalletProvider';

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('./ConnectWallet', () => ({
  ConnectWallet: () => <div data-testid="connect-wallet">Connect Wallet</div>,
}));

vi.mock('./WalletIslandContent', () => ({
  WalletIslandContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wallet-island-content">{children}</div>
  ),
}));

vi.mock('./WalletIslandProvider', () => ({
  useWalletIslandContext: vi.fn(),
  WalletIslandProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('WalletIsland', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;

  beforeEach(() => {
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
    expect(screen.queryByTestId('wallet-island-content')).toBeNull();
    expect(screen.queryByTestId('child-content')).toBeNull();
  });

  it('renders wallet-island-content when isSubComponentOpen is true', () => {
    mockUseWalletContext.mockReturnValue({ isSubComponentOpen: true });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletAdvanced>
          <div data-testid="child-content">Some content</div>
        </WalletAdvanced>
      </Wallet>,
    );

    expect(screen.getByTestId('wallet-island-content')).toBeDefined();
    expect(screen.getByTestId('child-content')).toBeDefined();
  });
});
