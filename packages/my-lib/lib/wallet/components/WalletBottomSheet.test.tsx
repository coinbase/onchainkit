import '@testing-library/jest-dom';
import { Identity } from '@/identity';
import {
  IdentityProvider,
  useIdentityContext,
} from '@/identity/components/IdentityProvider';
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { WalletBottomSheet } from './WalletBottomSheet';
import { useWalletContext } from './WalletProvider';

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

vi.mock('@/identity/components/Identity', () => ({
  Identity: vi.fn(({ address, children }) => (
    <IdentityProvider address={address}>{children}</IdentityProvider>
  )),
}));

const useWalletContextMock = useWalletContext as Mock;

describe('WalletBottomSheet', () => {
  it('renders null when address is not provided', () => {
    useWalletContextMock.mockReturnValue({
      address: null,
      isSubComponentOpen: true,
    });
    render(<WalletBottomSheet>Test Children</WalletBottomSheet>);
    expect(screen.queryByText('Test Children')).not.toBeInTheDocument();
  });

  it('renders children when isSubComponentOpen is true and address is provided', () => {
    useWalletContextMock.mockReturnValue({
      address: '0x123',
      isSubComponentOpen: true,
    });
    render(<WalletBottomSheet>Test Children</WalletBottomSheet>);
    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });

  it('injects address prop to Identity component', async () => {
    const address = '0x123';
    useWalletContextMock.mockReturnValue({ address, isSubComponentOpen: true });
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
    useWalletContextMock.mockReturnValue({
      address: '0x123',
      isSubComponentOpen: false,
      setIsSubComponentOpen: vi.fn(),
    });
    render(<WalletBottomSheet>Content</WalletBottomSheet>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders overlay when isSubComponentOpen is true', () => {
    useWalletContextMock.mockReturnValue({
      address: '0x123',
      isSubComponentOpen: true,
      setIsSubComponentOpen: vi.fn(),
    });
    render(<WalletBottomSheet>Content</WalletBottomSheet>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('closes the bottom sheet when the overlay is clicked', () => {
    const setIsSubComponentOpenMock = vi.fn();
    useWalletContextMock.mockReturnValue({
      address: '0x123',
      isSubComponentOpen: true,
      setIsSubComponentOpen: setIsSubComponentOpenMock,
    });
    render(<WalletBottomSheet>Content</WalletBottomSheet>);
    fireEvent.click(screen.getByRole('button'));
    expect(setIsSubComponentOpenMock).toHaveBeenCalledWith(false);
  });

  it('closes the bottom sheet when Escape key is pressed', () => {
    const setIsSubComponentOpenMock = vi.fn();
    useWalletContextMock.mockReturnValue({
      address: '0x123',
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
