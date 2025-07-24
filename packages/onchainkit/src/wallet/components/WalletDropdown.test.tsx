import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useAccount, useDisconnect } from 'wagmi';
import { useName } from '../../identity/hooks/useName';
import { usePortfolio } from '../hooks/usePortfolio';
import { WalletDropdown } from './WalletDropdown';
import { useWalletContext } from './WalletProvider';

// Mock floating-ui
vi.mock('@floating-ui/react', () => {
  const mockUseFloating = vi.fn();
  return {
    useFloating: mockUseFloating,
    autoUpdate: vi.fn(),
    offset: vi.fn(),
    flip: vi.fn(),
    shift: vi.fn(),
    FloatingPortal: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="floating-portal">{children}</div>
    ),
  };
});

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useDisconnect: vi.fn(),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

vi.mock('../../identity/hooks/useName', () => ({
  useName: vi.fn(),
}));

vi.mock('../hooks/usePortfolio', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('../../identity', () => ({
  Identity: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="identity">{children}</div>
  ),
  Avatar: () => <div data-testid="avatar">Avatar</div>,
  Name: () => <div data-testid="name">Name</div>,
  Address: () => <div data-testid="address">Address</div>,
  EthBalance: () => <div data-testid="eth-balance">EthBalance</div>,
}));

const useWalletContextMock = useWalletContext as Mock;
const useAccountMock = useAccount as Mock;

describe('WalletDropdown', () => {
  let mockUseFloating: Mock;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Import the mock after clearing
    const floatingUi = await import('@floating-ui/react');
    mockUseFloating = floatingUi.useFloating as Mock;

    (useDisconnect as Mock).mockReturnValue({
      disconnect: vi.fn(),
      connectors: [],
    });
    useAccountMock.mockReturnValue({
      address: '0x123',
    });
    (usePortfolio as Mock).mockReturnValue({
      data: {
        tokenBalances: [],
      },
    });
    mockUseFloating.mockReturnValue({
      refs: {
        setReference: vi.fn(),
        setFloating: vi.fn(),
      },
      floatingStyles: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
      },
    });
  });

  it('renders null when address is not provided', () => {
    useAccountMock.mockReturnValue({
      address: undefined,
    });
    useWalletContextMock.mockReturnValue({
      isSubComponentOpen: true,
      breakpoint: 'md',
    });
    render(<WalletDropdown>Test Children</WalletDropdown>);
    expect(screen.queryByText('Test Children')).not.toBeInTheDocument();
  });

  it('renders null when isSubComponentOpen is false', () => {
    useWalletContextMock.mockReturnValue({
      breakpoint: 'md',
      isSubComponentOpen: false,
    });
    render(<WalletDropdown>Test Children</WalletDropdown>);
    const dropdown = screen.queryByTestId('ockWalletDropdown');
    expect(dropdown).toBeNull();
  });

  it('does not render anything if breakpoint is not defined', () => {
    useWalletContextMock.mockReturnValue({
      breakpoint: null,
      isSubComponentOpen: true,
    });

    render(<WalletDropdown>Content</WalletDropdown>);

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders default children', () => {
    useWalletContextMock.mockReturnValue({
      breakpoint: 'md',
      isSubComponentOpen: true,
      animations: {
        container: '',
        content: '',
      },
    });
    (useName as ReturnType<typeof vi.fn>).mockReturnValue({ data: '0x123' });

    render(<WalletDropdown />);

    const component = screen.getByText('Wallet');

    expect(component).toBeInTheDocument();
  });

  it('renders children', () => {
    useWalletContextMock.mockReturnValue({
      breakpoint: 'sm',
      isSubComponentOpen: true,
      animations: {
        container: '',
        content: '',
      },
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
      breakpoint: 'md',
      isSubComponentOpen: true,
      animations: {
        container: '',
        content: '',
      },
    });

    render(<WalletDropdown className="dropdown">Content</WalletDropdown>);

    const dropdown = screen.getByTestId('ockWalletDropdown');

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveClass('dropdown');
  });

  it('renders with floating portal and proper z-index', () => {
    useWalletContextMock.mockReturnValue({
      showSubComponentAbove: true,
      alignSubComponentRight: false,
      isSubComponentOpen: true,
      breakpoint: 'md',
      animations: {
        container: '',
        content: '',
      },
    });

    render(<WalletDropdown>Content</WalletDropdown>);

    const portal = screen.getByTestId('floating-portal');
    const dropdown = screen.getByTestId('ockWalletDropdown');

    expect(portal).toBeInTheDocument();
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveClass('z-50');
  });

  it('uses top-end placement when showSubComponentAbove and alignSubComponentRight are both true', () => {
    useWalletContextMock.mockReturnValue({
      showSubComponentAbove: true,
      alignSubComponentRight: true,
      isSubComponentOpen: true,
      breakpoint: 'md',
      animations: {
        container: '',
        content: '',
      },
    });

    render(<WalletDropdown>Content</WalletDropdown>);

    expect(mockUseFloating).toHaveBeenCalledWith({
      open: true,
      placement: 'top-end',
      middleware: expect.any(Array),
      whileElementsMounted: expect.any(Function),
    });
  });

  it('uses bottom-end placement when showSubComponentAbove is false and alignSubComponentRight is true', () => {
    useWalletContextMock.mockReturnValue({
      showSubComponentAbove: false,
      alignSubComponentRight: true,
      isSubComponentOpen: true,
      breakpoint: 'md',
      animations: {
        container: '',
        content: '',
      },
    });

    render(<WalletDropdown>Content</WalletDropdown>);

    expect(mockUseFloating).toHaveBeenCalledWith({
      open: true,
      placement: 'bottom-end',
      middleware: expect.any(Array),
      whileElementsMounted: expect.any(Function),
    });
  });

  it('sets floating reference when connectRef exists', () => {
    const mockSetReference = vi.fn();
    const mockConnectRef = { current: document.createElement('div') };

    mockUseFloating.mockReturnValue({
      refs: {
        setReference: mockSetReference,
        setFloating: vi.fn(),
      },
      floatingStyles: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
      },
    });

    useWalletContextMock.mockReturnValue({
      showSubComponentAbove: false,
      alignSubComponentRight: false,
      isSubComponentOpen: true,
      breakpoint: 'md',
      connectRef: mockConnectRef,
      animations: {
        container: '',
        content: '',
      },
    });

    render(<WalletDropdown>Content</WalletDropdown>);

    expect(mockSetReference).toHaveBeenCalledWith(mockConnectRef.current);
  });
});
