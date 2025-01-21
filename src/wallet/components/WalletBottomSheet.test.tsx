import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import {
  IdentityProvider,
  useIdentityContext,
} from '@/identity/components/IdentityProvider';
import { Identity } from '@/identity';
import { WalletBottomSheet } from './WalletBottomSheet';
import { useWalletContext } from './WalletProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

vi.mock('@/identity/components/Identity', () => ({
  Identity: vi.fn(({ address, children }) => (
    <IdentityProvider address={address}>{children}</IdentityProvider>
  )),
}));

const useWalletContextMock = useWalletContext as Mock;
const useAccountMock = useAccount as Mock;

describe('WalletBottomSheet', () => {
  it('renders null when address is not provided', () => {
    useWalletContextMock.mockReturnValue({ isSubComponentOpen: true });
    useAccountMock.mockReturnValue({ address: null });
    render(<WalletBottomSheet>Test Children</WalletBottomSheet>);
    expect(screen.queryByText('Test Children')).not.toBeInTheDocument();
  });

  it('renders children when isSubComponentOpen is true and address is provided', () => {
    useWalletContextMock.mockReturnValue({ isSubComponentOpen: true });
    useAccountMock.mockReturnValue({ address: '0x123' });
    render(<WalletBottomSheet>Test Children</WalletBottomSheet>);
    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });

  it('injects address prop to Identity component', async () => {
    const address = '0x123';
    useWalletContextMock.mockReturnValue({ isSubComponentOpen: true });
    useAccountMock.mockReturnValue({ address });
    const { result } = renderHook(() => useIdentityContext(), {
      wrapper: ({ children }) => (
        <WalletBottomSheet>
          <Identity>{children}</Identity>
        </WalletBottomSheet>
      ),
    });
    await waitFor(() => {
      expect(result.current.address).toEqual(address);
    });
  });

  it('does not render overlay when isSubComponentOpen is false', () => {
    useAccountMock.mockReturnValue({ address: '0x123' });
    useWalletContextMock.mockReturnValue({
      isSubComponentOpen: false,
      setIsSubComponentOpen: vi.fn(),
    });
    render(<WalletBottomSheet>Content</WalletBottomSheet>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders overlay when isSubComponentOpen is true', () => {
    useAccountMock.mockReturnValue({ address: '0x123' });
    useWalletContextMock.mockReturnValue({
      isSubComponentOpen: true,
      setIsSubComponentOpen: vi.fn(),
    });
    render(<WalletBottomSheet>Content</WalletBottomSheet>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('closes the bottom sheet when the overlay is clicked', () => {
    const setIsSubComponentOpenMock = vi.fn();
    useAccountMock.mockReturnValue({ address: '0x123' });
    useWalletContextMock.mockReturnValue({
      isSubComponentOpen: true,
      setIsSubComponentOpen: setIsSubComponentOpenMock,
    });
    render(<WalletBottomSheet>Content</WalletBottomSheet>);
    fireEvent.click(screen.getByRole('button'));
    expect(setIsSubComponentOpenMock).toHaveBeenCalledWith(false);
  });

  it('closes the bottom sheet when Escape key is pressed', () => {
    const setIsSubComponentOpenMock = vi.fn();
    useAccountMock.mockReturnValue({ address: '0x123' });
    useWalletContextMock.mockReturnValue({
      isSubComponentOpen: true,
      setIsSubComponentOpen: setIsSubComponentOpenMock,
    });
    render(<WalletBottomSheet>Content</WalletBottomSheet>);
    fireEvent.keyDown(screen.getByRole('button'), {
      key: 'Escape',
      code: 'Escape',
    });
    expect(setIsSubComponentOpenMock).toHaveBeenCalledWith(false);
  });
});
