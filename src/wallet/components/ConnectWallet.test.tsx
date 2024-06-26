/**
 * @jest-environment jsdom
 */
import React, { type ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAccount, useConnect } from 'wagmi';
import { mock } from '../../internal/testing/mock';
import { ConnectWallet } from './ConnectWallet';
import { useWalletContext } from './WalletProvider';

jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useConnect: jest.fn(),
}));

jest.mock('../../identity/components/IdentityProvider', () => ({
  IdentityProvider: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('./WalletProvider', () => ({
  useWalletContext: jest.fn(),
  WalletProvider: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

const useAccountMock = mock(useAccount);
const useConnectMock = mock(useConnect);
const useWalletContextMock = mock(useWalletContext);

describe('ConnectWallet', () => {
  beforeEach(() => {
    useAccountMock.return({
      address: '',
      status: 'disconnected',
    });
    useConnectMock.return({
      connectors: [{ id: 'mockConnector' }],
      connect: jest.fn(),
      status: 'idle',
    });
    useWalletContextMock.return({
      isOpen: false,
      setIsOpen: jest.fn(),
    });
  });

  it('renders connect button when disconnected', () => {
    render(<ConnectWallet label="Connect Wallet" />);

    const button = screen.getByTestId('ockConnectWallet_ConnectButton');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Connect Wallet');
  });

  it('renders spinner when loading', () => {
    useConnectMock.return({
      connectors: [{ id: 'mockConnector' }],
      connect: jest.fn(),
      status: 'pending',
    });
    useAccountMock.return({
      address: '',
      status: 'connecting',
    });

    render(<ConnectWallet label="Connect Wallet" />);

    const spinner = screen.getByTestId('ockSpinner');
    expect(spinner).toBeInTheDocument();
  });

  it('renders children when connected', () => {
    useAccountMock.return({
      address: '0x123',
      status: 'connected',
    });

    render(
      <ConnectWallet label="Connect Wallet">
        <div>Wallet Connected</div>
      </ConnectWallet>,
    );

    const connectedText = screen.getByText('Wallet Connected');
    expect(connectedText).toBeInTheDocument();
  });

  it('calls connect function when connect button is clicked', () => {
    const connectMock = jest.fn();
    useConnectMock.return({
      connectors: [{ id: 'mockConnector' }],
      connect: connectMock,
      status: 'idle',
    });

    render(<ConnectWallet label="Connect Wallet" />);

    const button = screen.getByTestId('ockConnectWallet_ConnectButton');
    fireEvent.click(button);

    expect(connectMock).toHaveBeenCalledWith({
      connector: { id: 'mockConnector' },
    });
  });

  it('toggles wallet modal on button click when connected', () => {
    const setIsOpenMock = jest.fn();
    useAccountMock.return({
      address: '0x123',
      status: 'connected',
    });
    useWalletContextMock.return({
      isOpen: false,
      setIsOpen: setIsOpenMock,
    });

    render(
      <ConnectWallet label="Connect Wallet">
        <div>Wallet Connected</div>
      </ConnectWallet>,
    );

    const button = screen.getByText('Wallet Connected');
    fireEvent.click(button);

    expect(setIsOpenMock).toHaveBeenCalledWith(true);
  });

  it('applies bg-secondary-active class when isOpen is true', () => {
    useWalletContextMock.return({
      isOpen: true,
      setIsOpen: jest.fn(),
    });
    useAccountMock.return({
      address: '0x123',
      status: 'connected',
    });
    useConnectMock.return({
      connectors: [{ id: 'test-connector' }],
      connect: jest.fn(),
      status: 'idle',
    });

    render(
      <ConnectWallet>
        <span>Test Children</span>
      </ConnectWallet>,
    );

    const button = screen.getByTestId('ockConnectWallet_Connected');
    expect(button).toHaveClass('bg-secondary-active');
  });
});
