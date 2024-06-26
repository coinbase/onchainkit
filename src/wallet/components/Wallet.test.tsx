/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectWallet } from './ConnectWallet';
import { WalletDropdown } from './WalletDropdown';
import { Wallet } from './Wallet';

jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useConnect: jest.fn(),
  useDisconnect: jest.fn(),
}));

describe('Wallet Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAccount as jest.Mock).mockReturnValue({ status: 'disconnected' });
    (useConnect as jest.Mock).mockReturnValue({
      connectors: [{ name: 'injected' }],
      connect: jest.fn(),
    });
    (useDisconnect as jest.Mock).mockReturnValue({ disconnect: jest.fn() });
  });

  it('should render the Wallet component with ConnectWallet', async () => {
    render(
      <Wallet>
        <ConnectWallet />
        <WalletDropdown>
          <div />
        </WalletDropdown>
      </Wallet>,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('ockConnectWallet_Container'),
      ).toBeInTheDocument();
    });
  });
});
