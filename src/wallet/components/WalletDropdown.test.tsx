/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useAccount } from 'wagmi';
import { WalletDropdown } from './WalletDropdown';
import { useWalletContext } from './WalletProvider';

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
});
