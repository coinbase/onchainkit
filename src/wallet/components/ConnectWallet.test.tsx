import { fireEvent, render, screen } from '@testing-library/react';
/**
 * @vitest-environment jsdom
 */
import type { ReactNode } from 'react';
import '@testing-library/jest-dom';
import { useAccount, useConnect } from 'wagmi';
import { ConnectWallet } from './ConnectWallet';
import { useWalletContext } from './WalletProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
}));

vi.mock('../../identity/components/IdentityProvider', () => ({
  IdentityProvider: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('ConnectWallet', () => {
  beforeEach(() => {
    (useAccount as vi.Mock).mockReturnValue({
      address: '',
      status: 'disconnected',
    });
    (useConnect as vi.Mock).mockReturnValue({
      connectors: [{ id: 'mockConnector' }],
      connect: vi.fn(),
      status: 'idle',
    });
    (useWalletContext as vi.Mock).mockReturnValue({
      isOpen: false,
      setIsOpen: vi.fn(),
    });
  });

  it('renders connect button when disconnected', () => {
    render(<ConnectWallet text="Connect Wallet" />);

    const button = screen.getByTestId('ockConnectButton');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Connect Wallet');
  });

  it('renders spinner when loading', () => {
    (useConnect as vi.Mock).mockReturnValue({
      connectors: [{ id: 'mockConnector' }],
      connect: vi.fn(),
      status: 'pending',
    });
    (useAccount as vi.Mock).mockReturnValue({
      address: '',
      status: 'connecting',
    });

    render(<ConnectWallet text="Connect Wallet" />);

    const spinner = screen.getByTestId('ockSpinner');
    expect(spinner).toBeInTheDocument();
  });

  it('renders children when connected', () => {
    (useAccount as vi.Mock).mockReturnValue({
      address: '0x123',
      status: 'connected',
    });

    render(
      <ConnectWallet text="Connect Wallet">
        <div>Wallet Connected</div>
      </ConnectWallet>,
    );

    const connectedText = screen.getByText('Wallet Connected');
    expect(connectedText).toBeInTheDocument();
  });

  it('calls connect function when connect button is clicked', () => {
    const connectMock = vi.fn();
    (useConnect as vi.Mock).mockReturnValue({
      connectors: [{ id: 'mockConnector' }],
      connect: connectMock,
      status: 'idle',
    });

    render(<ConnectWallet text="Connect Wallet" />);

    const button = screen.getByTestId('ockConnectButton');
    fireEvent.click(button);

    expect(connectMock).toHaveBeenCalledWith({
      connector: { id: 'mockConnector' },
    });
  });

  it('toggles wallet modal on button click when connected', () => {
    const setIsOpenMock = vi.fn();
    (useAccount as vi.Mock).mockReturnValue({
      address: '0x123',
      status: 'connected',
    });
    (useWalletContext as vi.Mock).mockReturnValue({
      isOpen: false,
      setIsOpen: setIsOpenMock,
    });

    render(
      <ConnectWallet text="Connect Wallet">
        <div>Wallet Connected</div>
      </ConnectWallet>,
    );

    const button = screen.getByText('Wallet Connected');
    fireEvent.click(button);

    expect(setIsOpenMock).toHaveBeenCalledWith(true);
  });

  it('applies bg-secondary-active class when isOpen is true', () => {
    (useWalletContext as vi.Mock).mockReturnValue({
      isOpen: true,
      setIsOpen: vi.fn(),
    });
    (useAccount as vi.Mock).mockReturnValue({
      address: '0x123',
      status: 'connected',
    });
    (useConnect as vi.Mock).mockReturnValue({
      connectors: [{ id: 'test-connector' }],
      connect: vi.fn(),
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
