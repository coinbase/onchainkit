import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount, useConnect } from 'wagmi';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { WalletEvent } from '../../core/analytics/types';
import { useOnchainKit } from '../../useOnchainKit';
import { ConnectWallet } from './ConnectWallet';
import { ConnectWalletText } from './ConnectWalletText';
import { useWalletContext } from './WalletProvider';
import type { Connector } from 'wagmi';
import type { UseAccountReturnType, UseConnectReturnType, Config } from 'wagmi';
import type { WalletContextType } from '../types';

const openConnectModalMock = vi.fn();

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
  useConnectors: vi.fn(() => ({ connectors: [{ id: 'mockConnector' }] })),
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

vi.mock('@/identity', () => ({
  Name: () => <div data-testid="ockName">Name</div>,
  Avatar: () => <div data-testid="ockAvatar">Avatar</div>,
}));

vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: {
    Custom: ({
      children,
    }: {
      children: (props: { openConnectModal: () => void }) => ReactNode;
    }) => children({ openConnectModal: openConnectModalMock }),
  },
}));

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('../../core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(),
}));

describe('ConnectWallet', () => {
  const mockSendAnalytics = vi.fn();

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    vi.mocked(useAccount).mockReturnValue({
      address: '0x0' as `0x${string}`,
      status: 'disconnected',
      isConnected: false,
      isConnecting: false,
      isDisconnected: true,
      isReconnecting: false,
      addresses: undefined,
      chain: undefined,
      chainId: undefined,
      connector: undefined,
    } as unknown as UseAccountReturnType<Config>);

    vi.mocked(useConnect).mockReturnValue({
      connectors: [
        {
          id: 'mockConnector',
          name: 'MockConnector',
          type: 'mock',
          connect: vi.fn(),
          disconnect: vi.fn(),
          getAccounts: vi.fn(),
          getProvider: vi.fn(),
          isAuthorized: vi.fn(),
        } as unknown as Connector,
      ],
      connect: vi.fn(),
      status: 'idle',
    } as unknown as UseConnectReturnType<Config, unknown>);

    vi.mocked(useWalletContext).mockReturnValue({
      isSubComponentOpen: false,
      handleClose: vi.fn(),
      setIsSubComponentOpen: vi.fn(),
      breakpoint: 'md',
      isConnectModalOpen: false,
      setIsConnectModalOpen: vi.fn(),
      isSubComponentClosing: false,
      isMobile: false,
      isConnecting: false,
      walletOpen: false,
    } as unknown as WalletContextType);

    vi.mocked(useOnchainKit).mockReturnValue({
      config: {
        wallet: { display: undefined },
        apiKey: 'test-api-key',
        address: '0x0' as `0x${string}`,
        chain: { id: 1 },
        rpcUrl: 'https://test.com',
        chains: [],
        projectId: '1',
        appMetadata: { name: 'Test App' },
      },
    } as unknown as ReturnType<typeof useOnchainKit>);

    vi.mocked(useAnalytics).mockReturnValue({
      sendAnalytics: mockSendAnalytics,
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
      connectors: [
        {
          id: 'mockConnector',
          name: 'MockConnector',
          type: 'mock',
          connect: vi.fn(),
          disconnect: vi.fn(),
          getAccounts: vi.fn(),
          getProvider: vi.fn(),
          isAuthorized: vi.fn(),
        } as unknown as Connector,
      ],
      connect: vi.fn(),
      status: 'pending',
    } as unknown as UseConnectReturnType<Config, unknown>);

    vi.mocked(useAccount).mockReturnValue({
      address: '0x0' as `0x${string}`,
      status: 'connecting',
      isConnected: false,
      isConnecting: true,
      isDisconnected: false,
      isReconnecting: false,
      addresses: undefined,
      chain: undefined,
      chainId: undefined,
      connector: undefined,
    } as unknown as UseAccountReturnType<Config>);

    render(<ConnectWallet text="Connect Wallet" />);
    const spinner = screen.getByTestId('ockSpinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should render children when connected', () => {
    vi.mocked(useAccount).mockReturnValue({
      address: '0x123' as `0x${string}`,
      status: 'connected',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      isReconnecting: false,
      addresses: ['0x123'] as Array<`0x${string}`>,
      chain: { id: 1 },
      chainId: 1,
      connector: {
        id: 'mockConnector',
        name: 'MockConnector',
      } as unknown as Connector,
    } as unknown as UseAccountReturnType<Config>);

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
    const mockSendAnalytics = vi.fn();

    vi.mocked(useConnect).mockReturnValue({
      connectors: [
        {
          name: 'TestConnector',
          id: 'mockConnector',
          type: 'mock',
          connect: vi.fn(),
          disconnect: vi.fn(),
          getAccounts: vi.fn(),
          getProvider: vi.fn(),
          isAuthorized: vi.fn(),
        } as unknown as Connector,
      ],
      connect: connectMock,
      status: 'idle',
    } as unknown as UseConnectReturnType<Config, unknown>);

    vi.mocked(useAnalytics).mockReturnValue({
      sendAnalytics: mockSendAnalytics,
    });

    render(<ConnectWallet text="Connect Wallet" />);

    const button = screen.getByTestId('ockConnectButton');
    fireEvent.click(button);

    expect(mockSendAnalytics).toHaveBeenCalledWith(
      WalletEvent.ConnectInitiated,
      {
        component: 'ConnectWallet',
      },
    );

    expect(connectMock).toHaveBeenCalledWith(
      {
        connector: expect.objectContaining({
          name: 'TestConnector',
          id: 'mockConnector',
        }),
      },
      {
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      },
    );

    connectMock.mock.calls[0][1].onSuccess();
    expect(mockSendAnalytics).toHaveBeenCalledWith(
      WalletEvent.ConnectSuccess,
      expect.objectContaining({
        walletProvider: 'TestConnector',
      }),
    );

    const error = new Error('Test error');
    connectMock.mock.calls[0][1].onError(error);
    expect(mockSendAnalytics).toHaveBeenCalledWith(WalletEvent.ConnectError, {
      error: 'Test error',
      metadata: {
        connector: 'TestConnector',
        component: 'ConnectWallet',
      },
    });
  });

  it('should toggle wallet modal on button click when connected', () => {
    const setIsSubComponentOpenMock = vi.fn();
    const handleCloseMock = vi.fn();

    vi.mocked(useAccount).mockReturnValue({
      address: '0x123' as `0x${string}`,
      status: 'connected',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      isReconnecting: false,
      addresses: ['0x123'] as Array<`0x${string}`>,
      chain: { id: 1 },
      chainId: 1,
      connector: {
        id: 'mockConnector',
        name: 'MockConnector',
      } as unknown as Connector,
    } as unknown as UseAccountReturnType<Config>);

    vi.mocked(useWalletContext).mockReturnValue({
      isSubComponentOpen: false,
      setIsSubComponentOpen: setIsSubComponentOpenMock,
      handleClose: handleCloseMock,
      breakpoint: 'md',
      isConnectModalOpen: false,
      setIsConnectModalOpen: vi.fn(),
      isSubComponentClosing: false,
      isMobile: false,
      isConnecting: false,
      walletOpen: false,
    } as unknown as WalletContextType);

    const { rerender } = render(
      <ConnectWallet text="Connect Wallet">
        <div>Wallet Connected</div>
      </ConnectWallet>,
    );
    const button = screen.getByText('Wallet Connected');
    fireEvent.click(button);
    expect(setIsSubComponentOpenMock).toHaveBeenCalledWith(true);

    vi.mocked(useWalletContext).mockReturnValue({
      isSubComponentOpen: true,
      setIsSubComponentOpen: setIsSubComponentOpenMock,
      handleClose: handleCloseMock,
      breakpoint: 'md',
      isConnectModalOpen: false,
      setIsConnectModalOpen: vi.fn(),
      isSubComponentClosing: false,
      isMobile: false,
      isConnecting: false,
      walletOpen: false,
    } as unknown as WalletContextType);

    rerender(
      <ConnectWallet text="Connect Wallet">
        <div>Wallet Connected</div>
      </ConnectWallet>,
    );

    fireEvent.click(button);
    expect(handleCloseMock).toHaveBeenCalled();
  });

  it('applies ock-bg-secondary-active class when isOpen is true', () => {
    vi.mocked(useWalletContext).mockReturnValue({
      isSubComponentOpen: true,
      handleClose: vi.fn(),
      setIsSubComponentOpen: vi.fn(),
      breakpoint: 'md',
      isConnectModalOpen: false,
      setIsConnectModalOpen: vi.fn(),
      isSubComponentClosing: false,
      isMobile: false,
      isConnecting: false,
      walletOpen: false,
    } as unknown as WalletContextType);

    vi.mocked(useAccount).mockReturnValue({
      address: '0x123' as `0x${string}`,
      status: 'connected',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      isReconnecting: false,
      addresses: ['0x123'] as Array<`0x${string}`>,
      chain: { id: 1 },
      chainId: 1,
      connector: {
        id: 'mockConnector',
        name: 'MockConnector',
      } as unknown as Connector,
    } as unknown as UseAccountReturnType<Config>);

    vi.mocked(useConnect).mockReturnValue({
      connectors: [
        {
          id: 'test-connector',
          name: 'TestConnector',
          type: 'mock',
          connect: vi.fn(),
          disconnect: vi.fn(),
          getAccounts: vi.fn(),
          getProvider: vi.fn(),
          isAuthorized: vi.fn(),
        } as unknown as Connector,
      ],
      connect: vi.fn(),
      status: 'idle',
    } as unknown as UseConnectReturnType<Config, unknown>);

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
      address: '0x123' as `0x${string}`,
      status: 'connected',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      isReconnecting: false,
      addresses: ['0x123'] as Array<`0x${string}`>,
      chain: { id: 1 },
      chainId: 1,
      connector: {
        id: 'mockConnector',
        name: 'MockConnector',
      } as unknown as Connector,
    } as unknown as UseAccountReturnType<Config>);

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

    mockUseAccount.mockReturnValue({
      address: undefined,
      status: 'disconnected',
      isConnected: false,
      isConnecting: false,
      isDisconnected: true,
      isReconnecting: false,
      addresses: undefined,
      chain: undefined,
      chainId: undefined,
      connector: undefined,
    } as unknown as UseAccountReturnType<Config>);

    vi.mocked(useConnect).mockReturnValue({
      connectors: [
        {
          id: 'mockConnector',
          name: 'MockConnector',
          type: 'mock',
          connect: vi.fn(),
          disconnect: vi.fn(),
          getAccounts: vi.fn(),
          getProvider: vi.fn(),
          isAuthorized: vi.fn(),
        } as unknown as Connector,
      ],
      connect: connectMock,
      status: 'idle',
    } as unknown as UseConnectReturnType<Config, unknown>);

    render(<ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />);

    const button = screen.getByTestId('ockConnectButton');
    fireEvent.click(button);

    connectMock.mock.calls[0][1].onSuccess();

    mockUseAccount.mockReturnValue({
      address: '0x123' as `0x${string}`,
      status: 'connected',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      isReconnecting: false,
      addresses: ['0x123'] as Array<`0x${string}`>,
      chain: { id: 1 },
      chainId: 1,
      connector: {
        id: 'mockConnector',
        name: 'MockConnector',
      } as unknown as Connector,
    } as unknown as UseAccountReturnType<Config>);

    render(<ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />);

    expect(onConnectMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onConnect callback when component is first mounted', () => {
    const mockUseAccount = vi.mocked(useAccount);
    mockUseAccount.mockReturnValue({
      address: '0x123' as `0x${string}`,
      status: 'connected',
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
      isReconnecting: false,
      addresses: ['0x123'] as Array<`0x${string}`>,
      chain: { id: 1 },
      chainId: 1,
      connector: {
        id: 'mockConnector',
        name: 'MockConnector',
      } as unknown as Connector,
    } as unknown as UseAccountReturnType<Config>);

    const onConnectMock = vi.fn();
    render(<ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />);

    expect(onConnectMock).toHaveBeenCalledTimes(0);
  });

  describe('wallet display modes', () => {
    it('should render modal when config.wallet.display is "modal"', () => {
      vi.mocked(useOnchainKit).mockReturnValue({
        config: {
          wallet: { display: 'modal' },
          apiKey: 'test-api-key',
          address: '0x0' as `0x${string}`,
          chain: { id: 1 },
          rpcUrl: 'https://test.com',
          chains: [],
          projectId: '1',
          appMetadata: { name: 'Test App' },
        },
      } as unknown as ReturnType<typeof useOnchainKit>);

      vi.mocked(useAccount).mockReturnValue({
        address: '0x0' as `0x${string}`,
        status: 'disconnected',
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        addresses: undefined,
        chain: undefined,
        chainId: undefined,
        connector: undefined,
      } as unknown as UseAccountReturnType<Config>);

      vi.mocked(useConnect).mockReturnValue({
        connectors: [
          {
            id: 'mockConnector',
            name: 'MockConnector',
            type: 'mock',
            connect: vi.fn(),
            disconnect: vi.fn(),
            getAccounts: vi.fn(),
            getProvider: vi.fn(),
            isAuthorized: vi.fn(),
          } as unknown as Connector,
        ],
        connect: vi.fn(),
        status: 'idle',
      } as unknown as UseConnectReturnType<Config, unknown>);

      const setIsConnectModalOpenMock = vi.fn();
      vi.mocked(useWalletContext).mockReturnValue({
        isConnectModalOpen: true,
        setIsConnectModalOpen: setIsConnectModalOpenMock,
        breakpoint: 'md',
        isSubComponentOpen: false,
        setIsSubComponentOpen: vi.fn(),
        isSubComponentClosing: false,
        isMobile: false,
        isConnecting: false,
        walletOpen: false,
        handleClose: vi.fn(),
      } as unknown as WalletContextType);

      render(<ConnectWallet text="Connect Wallet" />);

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);

      expect(setIsConnectModalOpenMock).toHaveBeenCalledWith(true);
      expect(screen.getByTestId('ockModalOverlay')).toBeInTheDocument();
    });

    it('should render direct connect when config.wallet.display is undefined', () => {
      const connectMock = vi.fn();
      vi.mocked(useConnect).mockReturnValue({
        connectors: [
          {
            id: 'mockConnector',
            name: 'MockConnector',
            type: 'mock',
            connect: vi.fn(),
            disconnect: vi.fn(),
            getAccounts: vi.fn(),
            getProvider: vi.fn(),
            isAuthorized: vi.fn(),
          } as unknown as Connector,
        ],
        connect: connectMock,
        status: 'idle',
      } as unknown as UseConnectReturnType<Config, unknown>);

      render(<ConnectWallet text="Connect Wallet" />);

      const connectButton = screen.getByTestId('ockConnectButton');
      fireEvent.click(connectButton);

      expect(connectMock).toHaveBeenCalledWith(
        {
          connector: expect.objectContaining({
            id: 'mockConnector',
            name: 'MockConnector',
            type: 'mock',
          }),
        },
        {
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        },
      );
    });
  });

  describe('connectWalletText handling', () => {
    it('should use custom text from ConnectWalletText component when provided', () => {
      vi.mocked(useAccount).mockReturnValue({
        address: '0x0' as `0x${string}`,
        status: 'disconnected',
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        addresses: undefined,
        chain: undefined,
        chainId: undefined,
        connector: undefined,
      } as unknown as UseAccountReturnType<Config>);

      render(
        <ConnectWallet>
          <ConnectWalletText>Custom Connect Text</ConnectWalletText>
        </ConnectWallet>,
      );

      const button = screen.getByTestId('ockConnectButton');
      expect(button).toHaveTextContent('Custom Connect Text');
    });

    it('should handle direct connect with onConnect callback', () => {
      const onConnectMock = vi.fn();
      const connectMock = vi.fn();

      vi.mocked(useConnect).mockReturnValue({
        connectors: [
          {
            id: 'mockConnector',
            name: 'MockConnector',
            type: 'mock',
            connect: vi.fn(),
            disconnect: vi.fn(),
            getAccounts: vi.fn(),
            getProvider: vi.fn(),
            isAuthorized: vi.fn(),
          } as unknown as Connector,
        ],
        connect: connectMock,
        status: 'idle',
      } as unknown as UseConnectReturnType<Config, unknown>);

      vi.mocked(useAccount).mockReturnValue({
        address: '0x0' as `0x${string}`,
        status: 'disconnected',
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        addresses: undefined,
        chain: undefined,
        chainId: undefined,
        connector: undefined,
      } as unknown as UseAccountReturnType<Config>);

      vi.mocked(useWalletContext).mockReturnValue({
        isConnectModalOpen: true,
        setIsConnectModalOpen: vi.fn(),
        breakpoint: 'md',
        isSubComponentOpen: false,
        setIsSubComponentOpen: vi.fn(),
        isSubComponentClosing: false,
        isMobile: false,
        isConnecting: false,
        walletOpen: false,
        handleClose: vi.fn(),
      } as unknown as WalletContextType);

      render(<ConnectWallet text="Connect" onConnect={onConnectMock} />);

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);

      connectMock.mock.calls[0][1].onSuccess();

      vi.mocked(useAccount).mockReturnValue({
        address: '0x123' as `0x${string}`,
        status: 'connected',
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
        isReconnecting: false,
        addresses: ['0x123'] as Array<`0x${string}`>,
        chain: { id: 1 },
        chainId: 1,
        connector: {
          id: 'mockConnector',
          name: 'MockConnector',
        } as unknown as Connector,
      } as unknown as UseAccountReturnType<Config>);

      expect(onConnectMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('modal handling', () => {
    it('should close modal when clicking close button', () => {
      vi.mocked(useOnchainKit).mockReturnValue({
        config: {
          wallet: { display: 'modal' },
          apiKey: 'test-api-key',
          address: '0x0' as `0x${string}`,
          chain: { id: 1 },
          rpcUrl: 'https://test.com',
          chains: [],
          projectId: '1',
          appMetadata: { name: 'Test App' },
        },
      } as unknown as ReturnType<typeof useOnchainKit>);

      vi.mocked(useAccount).mockReturnValue({
        address: '0x0' as `0x${string}`,
        status: 'disconnected',
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        addresses: undefined,
        chain: undefined,
        chainId: undefined,
        connector: undefined,
      } as unknown as UseAccountReturnType<Config>);

      const setIsConnectModalOpenMock = vi.fn();
      vi.mocked(useWalletContext).mockReturnValue({
        isConnectModalOpen: true,
        setIsConnectModalOpen: setIsConnectModalOpenMock,
        breakpoint: 'md',
        isSubComponentOpen: false,
        setIsSubComponentOpen: vi.fn(),
        isSubComponentClosing: false,
        isMobile: false,
        isConnecting: false,
        walletOpen: false,
        handleClose: vi.fn(),
      } as unknown as WalletContextType);

      render(<ConnectWallet text="Connect Wallet" />);

      const connectButton = screen.getByTestId('ockConnectButton');
      fireEvent.click(connectButton);

      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);

      expect(setIsConnectModalOpenMock).toHaveBeenCalledWith(false);
    });
  });

  describe('connection state handling', () => {
    it('should handle connection state changes and onConnect callback', async () => {
      const onConnectMock = vi.fn();
      const mockUseAccount = vi.mocked(useAccount);
      const connectMock = vi.fn();

      mockUseAccount.mockReturnValue({
        address: undefined,
        status: 'disconnected',
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        addresses: undefined,
        chain: undefined,
        chainId: undefined,
        connector: undefined,
      } as unknown as UseAccountReturnType<Config>);

      vi.mocked(useConnect).mockReturnValue({
        connectors: [
          {
            id: 'mockConnector',
            name: 'MockConnector',
            type: 'mock',
            connect: vi.fn(),
            disconnect: vi.fn(),
            getAccounts: vi.fn(),
            getProvider: vi.fn(),
            isAuthorized: vi.fn(),
          } as unknown as Connector,
        ],
        connect: connectMock,
        status: 'idle',
      } as unknown as UseConnectReturnType<Config, unknown>);

      const { rerender } = render(
        <ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />,
      );

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);

      const onSuccessCallback = connectMock.mock.calls[0][1].onSuccess;
      onSuccessCallback();

      mockUseAccount.mockReturnValue({
        address: '0x123' as `0x${string}`,
        status: 'connected',
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
        isReconnecting: false,
        addresses: ['0x123'] as Array<`0x${string}`>,
        chain: { id: 1 },
        chainId: 1,
        connector: {
          id: 'mockConnector',
          name: 'MockConnector',
        } as unknown as Connector,
      } as unknown as UseAccountReturnType<Config>);

      rerender(
        <ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />,
      );

      expect(onConnectMock).toHaveBeenCalledTimes(1);

      rerender(
        <ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />,
      );
      expect(onConnectMock).toHaveBeenCalledTimes(1);
    });

    it('should handle direct connection with onConnect callback', () => {
      const onConnectMock = vi.fn();
      const connectMock = vi.fn();

      vi.mocked(useConnect).mockReturnValue({
        connectors: [
          {
            id: 'mockConnector',
            name: 'MockConnector',
            type: 'mock',
            connect: vi.fn(),
            disconnect: vi.fn(),
            getAccounts: vi.fn(),
            getProvider: vi.fn(),
            isAuthorized: vi.fn(),
          } as unknown as Connector,
        ],
        connect: connectMock,
        status: 'idle',
      } as unknown as UseConnectReturnType<Config, unknown>);

      vi.mocked(useAccount).mockReturnValue({
        address: '0x0' as `0x${string}`,
        status: 'disconnected',
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        addresses: undefined,
        chain: undefined,
        chainId: undefined,
        connector: undefined,
      } as unknown as UseAccountReturnType<Config>);

      vi.mocked(useWalletContext).mockReturnValue({
        isConnectModalOpen: true,
        setIsConnectModalOpen: vi.fn(),
        breakpoint: 'md',
        isSubComponentOpen: false,
        setIsSubComponentOpen: vi.fn(),
        isSubComponentClosing: false,
        isMobile: false,
        isConnecting: false,
        walletOpen: false,
        handleClose: vi.fn(),
      } as unknown as WalletContextType);

      render(<ConnectWallet text="Connect" onConnect={onConnectMock} />);

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);

      connectMock.mock.calls[0][1].onSuccess();

      vi.mocked(useAccount).mockReturnValue({
        address: '0x123' as `0x${string}`,
        status: 'connected',
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
        isReconnecting: false,
        addresses: ['0x123'] as Array<`0x${string}`>,
        chain: { id: 1 },
        chainId: 1,
        connector: {
          id: 'mockConnector',
          name: 'MockConnector',
        } as unknown as Connector,
      } as unknown as UseAccountReturnType<Config>);

      expect(onConnectMock).toHaveBeenCalledTimes(1);
    });

    it('should handle hasClickedConnect state with onConnect callback', () => {
      const onConnectMock = vi.fn();
      const connectMock = vi.fn();

      vi.mocked(useConnect).mockReturnValue({
        connectors: [
          {
            id: 'mockConnector',
            name: 'MockConnector',
            type: 'mock',
            connect: vi.fn(),
            disconnect: vi.fn(),
            getAccounts: vi.fn(),
            getProvider: vi.fn(),
            isAuthorized: vi.fn(),
          } as unknown as Connector,
        ],
        connect: connectMock,
        status: 'idle',
      } as unknown as UseConnectReturnType<Config, unknown>);

      vi.mocked(useAccount).mockReturnValue({
        address: '0x0' as `0x${string}`,
        status: 'disconnected',
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        addresses: undefined,
        chain: undefined,
        chainId: undefined,
        connector: undefined,
      } as unknown as UseAccountReturnType<Config>);

      vi.mocked(useWalletContext).mockReturnValue({
        isConnectModalOpen: true,
        setIsConnectModalOpen: vi.fn(),
        breakpoint: 'md',
        isSubComponentOpen: false,
        setIsSubComponentOpen: vi.fn(),
        isSubComponentClosing: false,
        isMobile: false,
        isConnecting: false,
        walletOpen: false,
        handleClose: vi.fn(),
      } as unknown as WalletContextType);

      const { rerender } = render(
        <ConnectWallet text="Connect" onConnect={onConnectMock} />,
      );

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);

      connectMock.mock.calls[0][1].onSuccess();

      vi.mocked(useAccount).mockReturnValue({
        address: '0x123' as `0x${string}`,
        status: 'connected',
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
        isReconnecting: false,
        addresses: ['0x123'] as Array<`0x${string}`>,
        chain: { id: 1 },
        chainId: 1,
        connector: {
          id: 'mockConnector',
          name: 'MockConnector',
        } as unknown as Connector,
      } as unknown as UseAccountReturnType<Config>);

      rerender(
        <ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />,
      );

      expect(onConnectMock).toHaveBeenCalledTimes(1);
    });

    it('should handle hasClickedConnect state correctly when modal is used', () => {
      const onConnectMock = vi.fn();
      const mockUseAccount = vi.mocked(useAccount);
      const setIsConnectModalOpenMock = vi.fn();

      vi.mocked(useOnchainKit).mockReturnValue({
        config: {
          wallet: { display: 'modal' },
          apiKey: 'test-api-key',
          address: '0x0' as `0x${string}`,
          chain: { id: 1 },
          rpcUrl: 'https://test.com',
          chains: [],
          projectId: '1',
          appMetadata: { name: 'Test App' },
        },
      } as unknown as ReturnType<typeof useOnchainKit>);

      vi.mocked(useWalletContext).mockReturnValue({
        isConnectModalOpen: true,
        setIsConnectModalOpen: setIsConnectModalOpenMock,
        breakpoint: 'md',
        isSubComponentOpen: false,
        setIsSubComponentOpen: vi.fn(),
        isSubComponentClosing: false,
        isMobile: false,
        isConnecting: false,
        walletOpen: false,
        handleClose: vi.fn(),
      } as unknown as WalletContextType);

      mockUseAccount.mockReturnValue({
        address: undefined,
        status: 'disconnected',
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        addresses: undefined,
        chain: undefined,
        chainId: undefined,
        connector: undefined,
      } as unknown as UseAccountReturnType<Config>);

      const { rerender } = render(
        <ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />,
      );

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);
      expect(setIsConnectModalOpenMock).toHaveBeenCalledWith(true);

      mockUseAccount.mockReturnValue({
        address: '0x123' as `0x${string}`,
        status: 'connected',
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
        isReconnecting: false,
        addresses: ['0x123'] as Array<`0x${string}`>,
        chain: { id: 1 },
        chainId: 1,
        connector: {
          id: 'mockConnector',
          name: 'MockConnector',
        } as unknown as Connector,
      } as unknown as UseAccountReturnType<Config>);

      rerender(
        <ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />,
      );

      expect(onConnectMock).toHaveBeenCalledTimes(1);

      rerender(
        <ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />,
      );
      expect(onConnectMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('analytics', () => {
    it('should send analytics when connect button is clicked in modal mode', () => {
      vi.mocked(useOnchainKit).mockReturnValue({
        config: {
          wallet: { display: 'modal' },
          apiKey: 'test-api-key',
          address: '0x0' as `0x${string}`,
          chain: { id: 1 },
          rpcUrl: 'https://test.com',
          chains: [],
          projectId: '1',
          appMetadata: { name: 'Test App' },
        },
      } as unknown as ReturnType<typeof useOnchainKit>);

      vi.mocked(useConnect).mockReturnValue({
        connectors: [
          {
            name: 'TestConnector',
            id: 'mockConnector',
            type: 'mock',
            connect: vi.fn(),
            disconnect: vi.fn(),
            getAccounts: vi.fn(),
            getProvider: vi.fn(),
            isAuthorized: vi.fn(),
          } as unknown as Connector,
        ],
        connect: vi.fn(),
        status: 'idle',
      } as unknown as UseConnectReturnType<Config, unknown>);

      render(<ConnectWallet text="Connect Wallet" />);

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        WalletEvent.ConnectInitiated,
        {
          component: 'WalletModal',
        },
      );
    });

    it('should send analytics when direct connect is initiated', () => {
      const connectMock = vi.fn();
      vi.mocked(useConnect).mockReturnValue({
        connectors: [
          {
            name: 'TestConnector',
            id: 'mockConnector',
            type: 'mock',
            connect: vi.fn(),
            disconnect: vi.fn(),
            getAccounts: vi.fn(),
            getProvider: vi.fn(),
            isAuthorized: vi.fn(),
          } as unknown as Connector,
        ],
        connect: connectMock,
        status: 'idle',
      } as unknown as UseConnectReturnType<Config, unknown>);

      render(<ConnectWallet text="Connect Wallet" />);

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        WalletEvent.ConnectInitiated,
        {
          component: 'ConnectWallet',
        },
      );
    });

    it('should send analytics on successful connection', () => {
      const connectMock = vi.fn();
      vi.mocked(useConnect).mockReturnValue({
        connectors: [
          {
            name: 'TestConnector',
            id: 'mockConnector',
            type: 'mock',
            connect: vi.fn(),
            disconnect: vi.fn(),
            getAccounts: vi.fn(),
            getProvider: vi.fn(),
            isAuthorized: vi.fn(),
          } as unknown as Connector,
        ],
        connect: connectMock,
        status: 'idle',
      } as unknown as UseConnectReturnType<Config, unknown>);

      render(<ConnectWallet text="Connect Wallet" />);

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);

      connectMock.mock.calls[0][1].onSuccess();

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        WalletEvent.ConnectSuccess,
        expect.objectContaining({
          walletProvider: 'TestConnector',
        }),
      );
    });

    it('should send analytics on connection error', () => {
      const connectMock = vi.fn();
      vi.mocked(useConnect).mockReturnValue({
        connectors: [
          {
            name: 'TestConnector',
            id: 'mockConnector',
            type: 'mock',
            connect: vi.fn(),
            disconnect: vi.fn(),
            getAccounts: vi.fn(),
            getProvider: vi.fn(),
            isAuthorized: vi.fn(),
          } as unknown as Connector,
        ],
        connect: connectMock,
        status: 'idle',
      } as unknown as UseConnectReturnType<Config, unknown>);

      render(<ConnectWallet text="Connect Wallet" />);

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);

      connectMock.mock.calls[0][1].onError(new Error('Test error'));

      expect(mockSendAnalytics).toHaveBeenCalledWith(WalletEvent.ConnectError, {
        error: 'Test error',
        metadata: {
          connector: 'TestConnector',
          component: 'ConnectWallet',
        },
      });
    });

    it('should send analytics when account is connected with address', () => {
      const mockUseAccount = vi.mocked(useAccount);
      vi.mocked(useConnect).mockReturnValue({
        connectors: [
          {
            name: 'TestConnector',
            id: 'mockConnector',
            type: 'mock',
            connect: vi.fn(),
            disconnect: vi.fn(),
            getAccounts: vi.fn(),
            getProvider: vi.fn(),
            isAuthorized: vi.fn(),
          } as unknown as Connector,
        ],
        connect: vi.fn(),
        status: 'idle',
      } as unknown as UseConnectReturnType<Config, unknown>);

      mockUseAccount.mockReturnValue({
        address: '0x123' as `0x${string}`,
        status: 'connected',
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
        isReconnecting: false,
        addresses: ['0x123'] as Array<`0x${string}`>,
        chain: { id: 1 },
        chainId: 1,
        connector: {
          id: 'mockConnector',
          name: 'TestConnector',
        } as unknown as Connector,
      } as unknown as UseAccountReturnType<Config>);

      render(<ConnectWallet text="Connect Wallet" />);

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        WalletEvent.ConnectSuccess,
        {
          address: '0x123',
          walletProvider: 'TestConnector',
        },
      );
    });
  });
});
