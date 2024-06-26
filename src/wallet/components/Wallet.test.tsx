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
import { mock } from '../../internal/testing/mock';

jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useConnect: jest.fn(),
  useDisconnect: jest.fn(),
}));

describe('Wallet Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mock(useAccount).return({ status: 'disconnected' });
    mock(useConnect).return({
      connectors: [{ name: 'injected' }],
      connect: jest.fn(),
    });
    mock(useDisconnect).return({ disconnect: jest.fn() });
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
