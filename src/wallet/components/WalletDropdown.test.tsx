import '@testing-library/jest-dom';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { Identity } from '../../identity/components/Identity';
import {
  IdentityProvider,
  useIdentityContext,
} from '../../identity/components/IdentityProvider';
import { useBreakpoints } from '../../useBreakpoints';
import { WalletDropdown } from './WalletDropdown';
import { useWalletContext } from './WalletProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

vi.mock('../../useBreakpoints', () => ({
  useBreakpoints: vi.fn(),
}));

vi.mock('../../identity/components/Identity', () => ({
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
    useWalletContextMock.mockReturnValue({ isOpen: true });
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
    useWalletContextMock.mockReturnValue({ isOpen: true });
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
});
