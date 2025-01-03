import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConnectWallet } from './ConnectWallet';
import { Wallet } from './Wallet';
import { WalletIsland } from './WalletIsland';
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

  it('renders connect-wallet when isOpen is false', () => {
    mockUseWalletContext.mockReturnValue({ isOpen: false });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletIsland>
          <div data-testid="child-content">Some content</div>
        </WalletIsland>
      </Wallet>,
    );

    expect(screen.getByTestId('connect-wallet')).toBeDefined();
    expect(screen.queryByTestId('wallet-island-content')).toBeNull();
    expect(screen.queryByTestId('child-content')).toBeNull();
  });

  it('renders wallet-island-content when isOpen is true', () => {
    mockUseWalletContext.mockReturnValue({ isOpen: true });

    render(
      <Wallet>
        <ConnectWallet />
        <WalletIsland>
          <div data-testid="child-content">Some content</div>
        </WalletIsland>
      </Wallet>,
    );

    expect(screen.getByTestId('wallet-island-content')).toBeDefined();
    expect(screen.getByTestId('child-content')).toBeDefined();
  });
});
