/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useAccount, useConnect } from 'wagmi';
import { ConnectAccount } from './ConnectAccount';

jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useConnect: jest.fn(),
}));

describe('ConnectAccount Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAccount as jest.Mock).mockReturnValue({ status: 'disconnected' });
    (useConnect as jest.Mock).mockReturnValue({
      connectors: [{ name: 'injected' }],
      connect: jest.fn(),
    });
  });

  it('should display connect wallet button when disconnected', async () => {
    render(<ConnectAccount />);

    await waitFor(() => {
      const connectWalletButton = screen.getByText('Connect wallet');
      expect(connectWalletButton).toBeInTheDocument();
    });
  });

  it('should display connected when connected', async () => {
    (useAccount as jest.Mock).mockReturnValue({ status: 'connected' });

    render(<ConnectAccount />);

    await waitFor(() => {
      const connectedText = screen.getByText('Connected');
      expect(connectedText).toBeInTheDocument();
    });
  });

  it('should call connect when connect wallet button is clicked', async () => {
    render(<ConnectAccount />);

    await waitFor(() => {
      const connectWalletButton = screen.getByText('Connect wallet');
      connectWalletButton.click();
      expect(useConnect().connect).toHaveBeenCalledWith({ connector: { name: 'injected' } });
    });
  });
});
