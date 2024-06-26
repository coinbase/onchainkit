/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useAccount } from 'wagmi';
import { WalletDropdown } from './WalletDropdown';
import { useWalletContext } from './WalletProvider';
import { mock } from '../../internal/testing/mock';

jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
}));

jest.mock('./WalletProvider', () => ({
  useWalletContext: jest.fn(),
}));

const useWalletContextMock = mock(useWalletContext);
const useAccountMock = mock(useAccount);

describe('WalletDropdown', () => {
  it('renders null when isOpen is false', () => {
    useWalletContextMock.return({ isOpen: false });
    useAccountMock.return({ address: '0x123' });

    render(<WalletDropdown>Test Children</WalletDropdown>);

    expect(screen.queryByText('Test Children')).not.toBeInTheDocument();
  });

  it('renders null when address is not provided', () => {
    useWalletContextMock.return({ isOpen: true });
    useAccountMock.return({ address: null });

    render(<WalletDropdown>Test Children</WalletDropdown>);

    expect(screen.queryByText('Test Children')).not.toBeInTheDocument();
  });

  it('renders children when isOpen is true and address is provided', () => {
    useWalletContextMock.return({ isOpen: true });
    useAccountMock.return({ address: '0x123' });

    render(<WalletDropdown>Test Children</WalletDropdown>);

    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });
});
