import '@testing-library/jest-dom';
import {
  IdentityProvider,
} from '@/identity/components/IdentityProvider';
import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { WalletDropdown } from './WalletDropdown';
import { useWalletContext } from './WalletProvider';
import { useDisconnect } from 'wagmi';

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

  it('renders WalletBottomSheet when breakpoint is "sm"', () => {
    useWalletContextMock.mockReturnValue({
      address: '0x123',
      breakpoint: 'sm',
      isSubComponentOpen: true,
    });

    render(<WalletDropdown className="bottom-sheet">Content</WalletDropdown>);

    const bottomSheet = screen.getByTestId('ockWalletBottomSheet');

    expect(bottomSheet).toBeInTheDocument();
    expect(bottomSheet).toHaveClass('bottom-sheet');
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

  it('sets animation classes correctly based on isClosing', () => {
    useWalletContextMock.mockReturnValue({
      address: '0x123',
      isSubComponentOpen: true,
      isSubComponentClosing: false,
      breakpoint: 'md',
    });
    const { rerender } = render(<WalletDropdown>Content</WalletDropdown>);
    const dropdown = screen.getByTestId('ockWalletDropdown');
    expect(dropdown).toHaveClass(
      'fade-in slide-in-from-top-1.5 animate-in duration-300 ease-out',
    );

    useWalletContextMock.mockReturnValue({
      address: '0x123',
      isSubComponentOpen: true,
      isSubComponentClosing: true,
      breakpoint: 'md',
    });
    rerender(<WalletDropdown>Content</WalletDropdown>);
    expect(dropdown).toHaveClass(
      'fade-out slide-out-to-top-1.5 animate-out fill-mode-forwards ease-in-out',
    );
  });

  it('should handle wallet closing correctly', async () => {
    const mockSetIsSubComponentOpen = vi.fn();
    const mockSetIsSubComponentClosing = vi.fn();

    useWalletContextMock.mockReturnValue({
      address: '0x123',
      isSubComponentOpen: true,
      isSubComponentClosing: false,
      setIsSubComponentOpen: mockSetIsSubComponentOpen,
      setIsSubComponentClosing: mockSetIsSubComponentClosing,
      breakpoint: 'md',
    });

    const { rerender } = render(
      <WalletDropdown>
        <div>Content</div>
      </WalletDropdown>,
    );

    const dropdown = screen.getByTestId('ockWalletDropdown');
    expect(dropdown).toHaveClass('fade-in slide-in-from-top-1.5');

    useWalletContextMock.mockReturnValue({
      address: '0x123',
      isSubComponentOpen: true,
      isSubComponentClosing: true,
      setIsSubComponentOpen: mockSetIsSubComponentOpen,
      setIsSubComponentClosing: mockSetIsSubComponentClosing,
      breakpoint: 'md',
    });

    rerender(
      <WalletDropdown>
        <div>Content</div>
      </WalletDropdown>,
    );

    fireEvent.animationEnd(dropdown);

    expect(mockSetIsSubComponentOpen).toHaveBeenCalledWith(false);
    expect(mockSetIsSubComponentClosing).toHaveBeenCalledWith(false);
  });
});
