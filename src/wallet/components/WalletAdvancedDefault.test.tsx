import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount, useConnect } from 'wagmi';
import { WalletAdvancedDefault } from './WalletAdvancedDefault';
import { useWalletContext } from './WalletProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
  useConfig: vi.fn(),
}));

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('../../core-react/identity/hooks/useAvatar', () => ({
  useAvatar: () => ({ data: null, isLoading: false }),
}));

vi.mock('../../core-react/identity/hooks/useName', () => ({
  useName: () => ({ data: null, isLoading: false }),
}));

vi.mock('./WalletAdvancedProvider', () => ({
  useWalletAdvancedContext: vi.fn(),
  WalletAdvancedProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('./WalletAdvancedContent', () => ({
  WalletAdvancedContent: () => (
    <div data-testid="ockWalletAdvancedContent">WalletAdvancedContent</div>
  ),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('WalletAdvancedDefault', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    (useConnect as ReturnType<typeof vi.fn>).mockReturnValue({
      connectors: [],
      status: 'disconnected',
    });
    (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'disconnected',
      address: '',
    });
    (useWalletContext as Mock).mockReturnValue({
      isSubComponentOpen: false,
    });
  });

  it('renders ConnectWallet in disconnected state', () => {
    mockUseWalletContext.mockReturnValue({ isSubComponentOpen: false });

    render(<WalletAdvancedDefault />);

    expect(screen.getByTestId('ockConnectWallet_Container')).toBeDefined();
  });

  it('renders Avatar and Name in connected state and isOpen is false', () => {
    (useConnect as ReturnType<typeof vi.fn>).mockReturnValue({
      connectors: [],
      status: 'connected',
    });
    (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'connected',
      address: '0x123',
    });

    mockUseWalletContext.mockReturnValue({ isSubComponentOpen: false });

    render(<WalletAdvancedDefault />);

    expect(screen.getByTestId('ockAvatar_ImageContainer')).toBeDefined();
    expect(screen.getByTestId('ockIdentity_Text')).toBeDefined();
  });

  it('renders WalletAdvancedContent in connected state and isOpen is true', () => {
    (useConnect as ReturnType<typeof vi.fn>).mockReturnValue({
      connectors: [],
      status: 'connected',
    });
    (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'connected',
      address: '0x123',
    });

    mockUseWalletContext.mockReturnValue({ isSubComponentOpen: true });

    render(<WalletAdvancedDefault />);

    expect(screen.getByTestId('ockWalletAdvancedContent')).toBeDefined();
  });
});
