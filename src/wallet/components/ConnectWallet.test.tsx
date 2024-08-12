import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
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

vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: {
    Custom: ({ children }: { children: (props: any) => ReactNode }) =>
      children({ openConnectModal: vi.fn() }),
  },
}));

describe('ConnectWallet', () => {
  beforeEach(() => {
    vi.mocked(useAccount).mockReturnValue({
      address: '',
      status: 'disconnected',
    });
    vi.mocked(useConnect).mockReturnValue({
      connectors: [{ id: 'mockConnector' }],
      connect: vi.fn(),
      status: 'idle',
    });
    vi.mocked(useWalletContext).mockReturnValue({
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
    vi.mocked(useConnect).mockReturnValue({
      connectors: [{ id: 'mockConnector' }],
      connect: vi.fn(),
      status: 'pending',
    });
    vi.mocked(useAccount).mockReturnValue({
      address: '',
      status: 'connecting',
    });

    render(<ConnectWallet text="Connect Wallet" />);

    const spinner = screen.getByTestId('ockSpinner');
    expect(spinner).toBeInTheDocument();
  });

  it('renders children when connected', () => {
    vi.mocked(useAccount).mockReturnValue({
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
    vi.mocked(useConnect).mockReturnValue({
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
    vi.mocked(useAccount).mockReturnValue({
      address: '0x123',
      status: 'connected',
    });
    vi.mocked(useWalletContext).mockReturnValue({
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

  it('applies bg-ock-secondary-active class when isOpen is true', () => {
    vi.mocked(useWalletContext).mockReturnValue({
      isOpen: true,
      setIsOpen: vi.fn(),
    });
    vi.mocked(useAccount).mockReturnValue({
      address: '0x123',
      status: 'connected',
    });
    vi.mocked(useConnect).mockReturnValue({
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
    expect(button).toHaveClass('bg-ock-secondary-active');
  });

  describe('withWalletAggregator', () => {
    beforeEach(() => {
      vi.mocked(useAccount).mockReturnValue({
        address: '',
        status: 'disconnected',
      });
      vi.mocked(useConnect).mockReturnValue({
        connectors: [{ id: 'mockConnector' }],
        connect: vi.fn(),
        status: 'idle',
      });
    });

    it('renders ConnectButtonRainboKit when withWalletAggregator is true', () => {
      render(
        <ConnectWallet text="Connect Wallet" withWalletAggregator={true} />,
      );

      const container = screen.getByTestId('ockConnectWallet_Container');
      expect(container).toBeInTheDocument();

      const connectButton = screen.getByTestId('ockConnectButton');
      expect(connectButton).toBeInTheDocument();
      expect(connectButton).toHaveTextContent('Connect Wallet');
    });

    it('renders regular ConnectButton when withWalletAggregator is false', () => {
      const connectMock = vi.fn();
      vi.mocked(useConnect).mockReturnValue({
        connectors: [{ id: 'mockConnector' }],
        connect: connectMock,
        status: 'idle',
      });

      render(
        <ConnectWallet text="Connect Wallet" withWalletAggregator={false} />,
      );

      const connectButton = screen.getByTestId('ockConnectButton');
      fireEvent.click(connectButton);

      expect(connectMock).toHaveBeenCalledWith({
        connector: { id: 'mockConnector' },
      });
    });
  });
});