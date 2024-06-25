/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectWallet } from './ConnectWallet';

jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useConnect: jest.fn(),
  useDisconnect: jest.fn(),
}));

describe('ConnectWallet Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAccount as jest.Mock).mockReturnValue({ status: 'disconnected' });
    (useConnect as jest.Mock).mockReturnValue({
      connectors: [{ name: 'injected' }],
      connect: jest.fn(),
    });
    (useDisconnect as jest.Mock).mockReturnValue({ disconnect: jest.fn() });
  });

  it('should display connect wallet button when disconnected', async () => {
    render(<ConnectWallet />);

    await waitFor(() => {
      const connectWalletButton = screen.getByText('Connect wallet');
      expect(connectWalletButton).toBeInTheDocument();
    });
  });

  it('should display connected wallet when connected', async () => {
    (useAccount as jest.Mock).mockReturnValue({
      status: 'connected',
      address: '0x1234',
    });

    render(<ConnectWallet />);

    await waitFor(() => {
      const connectedWallet = screen.getByText('Connected wallet: 0x1234');
      expect(connectedWallet).toBeInTheDocument();
    });
  });

  it('should call connect when connect button is clicked', async () => {
    render(<ConnectWallet />);

    await waitFor(() => {
      const connectWalletButton = screen.getByText('Connect wallet');
      connectWalletButton.click();
      expect(useConnect().connect).toHaveBeenCalled();
    });
  });

  it('should call disconnect when disconnect button is clicked', async () => {
    (useAccount as jest.Mock).mockReturnValue({
      status: 'connected',
      address: '0x1234',
    });

    render(<ConnectWallet />);

    await waitFor(() => {
      const connectedWallet = screen.getByText('Connected wallet: 0x1234');
      connectedWallet.click();
      expect(useDisconnect().disconnect).toHaveBeenCalled();
    });
  });

  it('should render children when provided and is connected', async () => {
    (useAccount as jest.Mock).mockReturnValue({
      status: 'connected',
      address: '0x1234',
    });
    render(<ConnectWallet>Custom Children</ConnectWallet>);

    await waitFor(() => {
      const customChildren = screen.getByText('Custom Children');
      expect(customChildren).toBeInTheDocument();
    });
  });
});
