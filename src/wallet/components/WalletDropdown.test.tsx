/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, renderHook, screen } from '@testing-library/react';
import { useAccount } from 'wagmi';
import { WalletDropdown } from './WalletDropdown';
import { useWalletContext } from './WalletProvider';
import { Identity } from '../../identity';
import { useIdentityContext } from '../../identity/components/IdentityProvider';

jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
}));

jest.mock('./WalletProvider', () => ({
  useWalletContext: jest.fn(),
}));

describe('WalletDropdown', () => {
  it('renders null when isOpen is false', () => {
    (useWalletContext as jest.Mock).mockReturnValue({ isOpen: false });
    (useAccount as jest.Mock).mockReturnValue({ address: '0x123' });

    render(<WalletDropdown>Test Children</WalletDropdown>);

    expect(screen.queryByText('Test Children')).not.toBeInTheDocument();
  });

  it('renders null when address is not provided', () => {
    (useWalletContext as jest.Mock).mockReturnValue({ isOpen: true });
    (useAccount as jest.Mock).mockReturnValue({ address: null });

    render(<WalletDropdown>Test Children</WalletDropdown>);

    expect(screen.queryByText('Test Children')).not.toBeInTheDocument();
  });

  it('renders children when isOpen is true and address is provided', () => {
    (useWalletContext as jest.Mock).mockReturnValue({ isOpen: true });
    (useAccount as jest.Mock).mockReturnValue({ address: '0x123' });

    render(<WalletDropdown>Test Children</WalletDropdown>);

    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });

  it('injects address prop to Identity component', () => {
    const address = '0x123';
    (useWalletContext as jest.Mock).mockReturnValue({ isOpen: true });
    (useAccount as jest.Mock).mockReturnValue({ address });

    const { result } = renderHook(() => useIdentityContext(), {
      wrapper: ({ children }) => (
        <WalletDropdown>
          <Identity>{children}</Identity>
          <div />
        </WalletDropdown>
      ),
    });

    expect(result.current.address).toEqual(address);
  });
});
