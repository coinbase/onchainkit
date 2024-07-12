/**
 * @vitest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { useAccount } from 'wagmi';
import { WalletDropdown } from './WalletDropdown';
import { useWalletContext } from './WalletProvider';
import { Identity } from '../../identity/components/Identity';
import {
  IdentityProvider,
  useIdentityContext,
} from '../../identity/components/IdentityProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

vi.mock('../../identity/components/Identity', () => ({
  Identity: vi.fn(({ address, children }) => (
    <IdentityProvider address={address}>{children}</IdentityProvider>
  )),
}));

const useWalletContextMock = useWalletContext as vi.Mock;
const useAccountMock = useAccount as vi.Mock;

describe('WalletDropdown', () => {
  it('renders null when isOpen is false', () => {
    useWalletContextMock.mockReturnValue({ isOpen: false });
    useAccountMock.mockReturnValue({ address: '0x123' });

    render(<WalletDropdown>Test Children</WalletDropdown>);

    expect(screen.queryByText('Test Children')).not.toBeInTheDocument();
  });

  it('renders null when address is not provided', () => {
    useWalletContextMock.mockReturnValue({ isOpen: true });
    useAccountMock.mockReturnValue({ address: null });

    render(<WalletDropdown>Test Children</WalletDropdown>);

    expect(screen.queryByText('Test Children')).not.toBeInTheDocument();
  });

  it('renders children when isOpen is true and address is provided', () => {
    useWalletContextMock.mockReturnValue({ isOpen: true });
    useAccountMock.mockReturnValue({ address: '0x123' });

    render(<WalletDropdown>Test Children</WalletDropdown>);

    expect(screen.getByText('Test Children')).toBeInTheDocument();
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
