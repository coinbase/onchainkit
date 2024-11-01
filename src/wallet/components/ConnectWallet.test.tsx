import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount, useConnect } from 'wagmi';
import { ConnectWallet } from './ConnectWallet';
import { ConnectWalletText } from './ConnectWalletText';
import { useWalletContext } from './WalletProvider';

const openConnectModalMock = vi.fn();

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
    Custom: ({
      children,
    }: { children: (props: { openConnectModal: () => void }) => ReactNode }) =>
      children({ openConnectModal: openConnectModalMock }),
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

  it('should render connect button when disconnected', () => {
    render(<ConnectWallet text="Connect Wallet" />);
    const button = screen.getByTestId('ockConnectButton');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Connect Wallet');
  });

  it('should render spinner when loading', () => {
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

  it('should render children when connected', () => {
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

  it('should call connect function when connect button is clicked', () => {
    const connectMock = vi.fn();
    vi.mocked(useConnect).mockReturnValue({
      connectors: [{ id: 'mockConnector' }],
      connect: connectMock,
      status: 'idle',
    });
    render(<ConnectWallet text="Connect Wallet" />);
    const button = screen.getByTestId('ockConnectButton');
    fireEvent.click(button);
    expect(connectMock).toHaveBeenCalledWith(
      {
        connector: { id: 'mockConnector' },
      },
      {
        onSuccess: expect.any(Function),
      },
    );
  });

  it('should toggle wallet modal on button click when connected', () => {
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

  it('applies ock-bg-secondary-active class when isOpen is true', () => {
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
    expect(button).toHaveClass('ock-bg-secondary-active');
  });

  it('should not render ConnectWalletText when children are present', () => {
    vi.mocked(useAccount).mockReturnValue({
      address: '0x123',
      status: 'connected',
    });
    render(
      <ConnectWallet>
        <ConnectWalletText>Not Render</ConnectWalletText>
        <div>Wallet Ciao</div>
      </ConnectWallet>,
    );
    const connectedText = screen.getByText('Wallet Ciao');
    expect(connectedText).toBeInTheDocument();
    expect(screen.queryByText('Not Render')).not.toBeInTheDocument();
  });

  it('should call onConnect callback when connect button is clicked', async () => {
    const mockUseAccount = vi.mocked(useAccount);
    const connectMock = vi.fn();
    const onConnectMock = vi.fn();

    // Initial state: disconnected
    mockUseAccount.mockReturnValue({
      address: undefined,
      status: 'disconnected',
    });

    vi.mocked(useConnect).mockReturnValue({
      connectors: [{ id: 'mockConnector' }],
      connect: connectMock,
      status: 'idle',
    });

    render(<ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />);

    const button = screen.getByTestId('ockConnectButton');
    fireEvent.click(button);

    // Simulate successful connection
    connectMock.mock.calls[0][1].onSuccess();

    // Update account status to connected
    mockUseAccount.mockReturnValue({
      address: '0x123',
      status: 'connected',
    });

    // Force a re-render to trigger the useEffect
    render(<ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />);

    expect(onConnectMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onConnect callback when component is first mounted', () => {
    const mockUseAccount = vi.mocked(useAccount);
    mockUseAccount.mockReturnValue({
      address: '0x123',
      status: 'connected',
    });

    const onConnectMock = vi.fn();
    render(<ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />);

    expect(onConnectMock).toHaveBeenCalledTimes(0);
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

    it('should render ConnectButtonRainbowKit when withWalletAggregator is true', () => {
      render(
        <ConnectWallet text="Connect Wallet" withWalletAggregator={true} />,
      );
      const container = screen.getByTestId('ockConnectWallet_Container');
      expect(container).toBeInTheDocument();
      const connectButton = screen.getByTestId('ockConnectButton');
      expect(connectButton).toBeInTheDocument();
      expect(connectButton).toHaveTextContent('Connect Wallet');
    });

    it('should render regular ConnectButton when withWalletAggregator is false', () => {
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
      expect(connectMock).toHaveBeenCalledWith(
        {
          connector: { id: 'mockConnector' },
        },
        {
          onSuccess: expect.any(Function),
        },
      );
    });

    it('should call openConnectModal function when connect button is clicked', () => {
      vi.mocked(useWalletContext).mockReturnValue({
        isOpen: false,
        setIsOpen: vi.fn(),
      });
      render(
        <ConnectWallet text="Connect Wallet" withWalletAggregator={true} />,
      );
      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);
      expect(openConnectModalMock).toHaveBeenCalled();
    });

    it('should call onConnect callback when connect button is clicked', () => {
      const mockUseAccount = vi.mocked(useAccount);
      mockUseAccount.mockReturnValue({
        address: undefined,
        status: 'disconnected',
      });

      const onConnectMock = vi.fn();
      render(
        <ConnectWallet
          text="Connect Wallet"
          onConnect={onConnectMock}
          withWalletAggregator={true}
        />,
      );
      const button = screen.getByTestId('ockConnectButton');

      mockUseAccount.mockReturnValue({
        address: '0x123',
        status: 'connected',
      });

      fireEvent.click(button);

      expect(onConnectMock).toHaveBeenCalledTimes(1);
    });
  });
});
