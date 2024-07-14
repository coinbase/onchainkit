import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectWallet } from './ConnectWallet';
import { WalletDropdown } from './WalletDropdown';
import { Wallet } from './Wallet';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
  useDisconnect: vi.fn(),
}));

describe('Wallet Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAccount as vi.Mock).mockReturnValue({ status: 'disconnected' });
    (useConnect as vi.Mock).mockReturnValue({
      connectors: [{ name: 'injected' }],
      connect: vi.fn(),
    });
    (useDisconnect as vi.Mock).mockReturnValue({ disconnect: vi.fn() });
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
