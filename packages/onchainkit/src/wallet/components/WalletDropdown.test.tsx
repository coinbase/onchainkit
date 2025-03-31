import '@testing-library/jest-dom';
import { IdentityProvider } from '@/identity/components/IdentityProvider';
import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDisconnect } from 'wagmi';
import { WalletDropdown } from './WalletDropdown';
import { useWalletContext } from './WalletProvider';

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('@/identity/components/Identity', () => ({
  Identity: vi.fn(({ address, children }) => (
    <IdentityProvider address={address}>{children}</IdentityProvider>
  )),
}));

vi.mock('wagmi', () => ({
  useDisconnect: vi.fn(),
  WagmiProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
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

const useWalletContextMock = useWalletContext as Mock;

describe('WalletDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useDisconnect as Mock).mockReturnValue({
      disconnect: vi.fn(),
      connectors: [],
    });
  });

  it('renders null when address is not provided', () => {
    useWalletContextMock.mockReturnValue({
      address: undefined,
      isSubComponentOpen: true,
    });
    render(<WalletDropdown>Test Children</WalletDropdown>);
    expect(screen.queryByText('Test Children')).not.toBeInTheDocument();
  });

  it('renders null when isSubComponentOpen is false', () => {
    useWalletContextMock.mockReturnValue({
      address: '0x123',
      breakpoint: 'md',
      isSubComponentOpen: false,
    });
    render(<WalletDropdown>Test Children</WalletDropdown>);
    const dropdown = screen.queryByTestId('ockWalletDropdown');
    expect(dropdown).toBeNull();
  });

  it('does not render anything if breakpoint is not defined', () => {
    useWalletContextMock.mockReturnValue({
      address: '0x123',
      breakpoint: null,
    });

    render(<WalletDropdown>Content</WalletDropdown>);

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders default children', () => {
    useWalletContextMock.mockReturnValue({
      address: '0x123',
      breakpoint: 'md',
      isSubComponentOpen: true,
    });

    render(<WalletDropdown />);

    const component = screen.getByText('Wallet');

    expect(component).toBeInTheDocument();
  });

  it('renders children', () => {
    useWalletContextMock.mockReturnValue({
      address: '0x123',
      breakpoint: 'sm',
      isSubComponentOpen: true,
    });

    render(
      <WalletDropdown className="bottom-sheet">
        <div>wallet dd children</div>
      </WalletDropdown>,
    );

    const component = screen.getByText('wallet dd children');

    expect(component).toBeInTheDocument();
  });

  it('renders WalletDropdown when breakpoint is not "sm"', () => {
    useWalletContextMock.mockReturnValue({
      address: '0x123',
      breakpoint: 'md',
      isSubComponentOpen: true,
    });

    render(<WalletDropdown className="dropdown">Content</WalletDropdown>);

    const dropdown = screen.getByTestId('ockWalletDropdown');

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveClass('dropdown');
  });

  it('sets classes correctly based on context values', () => {
    useWalletContextMock.mockReturnValue({
      address: '0x123',
      showSubComponentAbove: true,
      alignSubComponentRight: false,
      isSubComponentOpen: true,
      breakpoint: 'md',
    });
    const { rerender } = render(<WalletDropdown>Content</WalletDropdown>);
    const dropdown = screen.getByTestId('ockWalletDropdown');
    expect(dropdown).toHaveClass('absolute bottom-full left-0');

    useWalletContextMock.mockReturnValue({
      address: '0x123',
      showSubComponentAbove: false,
      alignSubComponentRight: true,
      isSubComponentOpen: true,
      breakpoint: 'md',
    });
    rerender(<WalletDropdown>Content</WalletDropdown>);
    expect(dropdown).toHaveClass('absolute top-full right-0');
  });
});
