import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import {
  IdentityProvider,
  useIdentityContext,
} from '../../core-react/identity/providers/IdentityProvider';
import { Identity } from '../../ui/react/identity';
import { useBreakpoints } from '../../ui/react/internal/hooks/useBreakpoints';
import { WalletDropdown } from './WalletDropdown';
import { useWalletContext } from './WalletProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn().mockReturnValue({ address: '0x123' }),
  WagmiProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('../../ui/react/internal/hooks/useBreakpoints', () => ({
  useBreakpoints: vi.fn(),
}));

vi.mock('../../ui/react/identity/components/Identity', () => ({
  Identity: vi.fn(({ address, children }) => (
    <IdentityProvider address={address}>{children}</IdentityProvider>
  )),
}));

const useWalletContextMock = useWalletContext as Mock;

const useAccountMock = useAccount as Mock;
const useBreakpointsMock = useBreakpoints as Mock;

describe('WalletDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders null when address is not provided', () => {
    useAccountMock.mockReturnValue({ address: undefined });
    useWalletContextMock.mockReturnValue({ isSubComponentOpen: true });
    render(<WalletDropdown>Test Children</WalletDropdown>);
    expect(screen.queryByText('Test Children')).not.toBeInTheDocument();
  });

  it('does not render anything if breakpoint is not defined', () => {
    useAccountMock.mockReturnValue({ address: '0x123' });
    useBreakpointsMock.mockReturnValue(null);

    render(<WalletDropdown>Content</WalletDropdown>);

    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders WalletBottomSheet when breakpoint is "sm"', () => {
    useAccountMock.mockReturnValue({ address: '0x123' });
    useBreakpointsMock.mockReturnValue('sm');

    render(<WalletDropdown className="bottom-sheet">Content</WalletDropdown>);

    const bottomSheet = screen.getByTestId('ockWalletBottomSheet');

    expect(bottomSheet).toBeInTheDocument();
    expect(bottomSheet).toHaveClass('bottom-sheet');
  });

  it('renders WalletDropdown when breakpoint is not "sm"', () => {
    useAccountMock.mockReturnValue({ address: '0x123' });
    useBreakpointsMock.mockReturnValue('md');

    render(<WalletDropdown className="dropdown">Content</WalletDropdown>);

    const dropdown = screen.getByTestId('ockWalletDropdown');

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveClass('dropdown');
  });

  it('injects address prop to Identity component', async () => {
    const address = '0x123';
    useWalletContextMock.mockReturnValue({ isSubComponentOpen: true });
    useAccountMock.mockReturnValue({ address });

    const { result } = renderHook(() => useIdentityContext(), {
      wrapper: ({ children }) => (
        <WalletDropdown>
          <Identity>{children}</Identity>
        </WalletDropdown>
      ),
    });

    await waitFor(() => {
      expect(result.current.address).toEqual(address);
    });
  });

  it('sets animation classes correctly based on isClosing', () => {
    useWalletContextMock.mockReturnValue({
      isSubComponentOpen: true,
      isSubComponentClosing: false,
    });
    const { rerender } = render(<WalletDropdown>Content</WalletDropdown>);
    const dropdown = screen.getByTestId('ockWalletDropdown');
    expect(dropdown).toHaveClass(
      'fade-in slide-in-from-top-1.5 animate-in duration-300 ease-out',
    );

    useWalletContextMock.mockReturnValue({
      isSubComponentOpen: true,
      isSubComponentClosing: true,
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
      isSubComponentOpen: true,
      isSubComponentClosing: false,
      setIsSubComponentOpen: mockSetIsSubComponentOpen,
      setIsSubComponentClosing: mockSetIsSubComponentClosing,
    });

    const { rerender } = render(
      <WalletDropdown>
        <div>Content</div>
      </WalletDropdown>,
    );

    const dropdown = screen.getByTestId('ockWalletDropdown');
    expect(dropdown).toHaveClass('fade-in slide-in-from-top-1.5');

    useWalletContextMock.mockReturnValue({
      isSubComponentOpen: true,
      isSubComponentClosing: true,
      setIsSubComponentOpen: mockSetIsSubComponentOpen,
      setIsSubComponentClosing: mockSetIsSubComponentClosing,
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
