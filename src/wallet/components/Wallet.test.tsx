/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectAccount } from './ConnectAccount';
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

  it('should render the Wallet component with ConnectAccount', async () => {
    render(
      <Wallet>
        <ConnectAccount />
      </Wallet>,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('ockConnectAccount_Container'),
      ).toBeInTheDocument();
    });
  });
});
