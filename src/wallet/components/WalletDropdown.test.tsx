/**
 * @jest-environment jsdom
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

jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
}));

jest.mock('./WalletProvider', () => ({
  useWalletContext: jest.fn(),
}));

jest.mock('../../identity/components/Identity', () => ({
  Identity: jest.fn(({ address, children }) => (
    <IdentityProvider address={address}>{children}</IdentityProvider>
  )),
}));

const useWalletContextMock = useWalletContext as jest.Mock;
const useAccountMock = useAccount as jest.Mock;

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
