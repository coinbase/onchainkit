import { useAvatar } from '@/identity/hooks/useAvatar';
import { useName } from '@/identity/hooks/useName';
import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount, useConnect } from 'wagmi';
import { WalletDefault } from './WalletDefault';
import { type WalletProviderReact, useWalletContext } from './WalletProvider';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
  useConfig: vi.fn(),
}));

vi.mock('./WalletProvider', () => ({
  WalletProvider: ({ children }: WalletProviderReact) => (
    <div data-testid="mock-WalletProvider">{children}</div>
  ),
  useWalletContext: vi.fn(),
}));

vi.mock('@/identity/hooks/useName', () => ({
  useName: vi.fn(),
}));
vi.mock('@/identity/hooks/useAvatar', () => ({
  useAvatar: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

function mock<T>(func: T) {
  return func as Mock;
}
const useNameMock = mock(useName);
const useAvatarMock = mock(useAvatar);

describe('WalletDefault Component', () => {
  beforeEach(() => {
    (useConnect as ReturnType<typeof vi.fn>).mockReturnValue({
      connectors: [],
      status: 'disconnected',
    });
    (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'disconnected',
      address: '',
    });
    (useWalletContext as Mock).mockReturnValue({
      isOpen: false,
    });
    useNameMock.mockReturnValue({ data: null, isLoading: true });
    useAvatarMock.mockReturnValue({ data: null, isLoading: true });
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

  it('renders the ConnectWallet component when disconnected', () => {
    render(<WalletDefault />);
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    expect(
      screen.getByTestId('ockConnectWallet_Container'),
    ).toBeInTheDocument();
  });

  it('renders the wallet address when connected', () => {
    (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'connected',
      address: '0x123',
    });
    (useConnect as ReturnType<typeof vi.fn>).mockReturnValue({
      connectors: [],
      status: 'connected',
    });
    (useWalletContext as Mock).mockReturnValue({
      isOpen: false,
      address: '0x123',
    });
    useNameMock.mockReturnValue({ data: null, isLoading: false });
    render(<WalletDefault />);
    const address = screen.getByText('0x123...x123');
    expect(address).toBeDefined();
  });
});
