import { fireEvent, render, screen } from '@testing-library/react';
import React, { createContext, type ReactNode, useContext } from 'react';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useAccount, useConnect } from 'wagmi';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { WalletEvent } from '../../core/analytics/types';
import { useOnchainKit } from '../../useOnchainKit';
import { ConnectWallet } from './ConnectWallet';
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
  WalletContext: createContext<WalletContextType | null>(null),
  WalletProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="mocked-wallet-provider">{children}</div>
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

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useContext: vi.fn(),
  };
});

describe('ConnectWallet', () => {
  const mockSendAnalytics = vi.fn();

  beforeEach(() => {
    // Set default behavior for useContext mock - return null by default
    // This simulates the normal behavior when ConnectWallet is used outside WalletProvider
    (useContext as Mock).mockReturnValue(null);

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
    render(<ConnectWallet disconnectedLabel="Connect Wallet" />);
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

    render(<ConnectWallet disconnectedLabel="Connect Wallet" />);
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
      <ConnectWallet disconnectedLabel="Connect Wallet">
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

    render(<ConnectWallet disconnectedLabel="Connect Wallet" />);

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
      <ConnectWallet disconnectedLabel="Connect Wallet">
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
      <ConnectWallet disconnectedLabel="Connect Wallet">
        <div>Wallet Connected</div>
      </ConnectWallet>,
    );

    fireEvent.click(button);
    expect(handleCloseMock).toHaveBeenCalled();
  });

  it('applies bg-ock-secondary-active class when isOpen is true', () => {
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
    expect(button).toHaveClass('bg-ock-secondary-active');
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
      <ConnectWallet disconnectedLabel="Connect Wallet">
        <div>Custom Children</div>
      </ConnectWallet>,
    );

    expect(screen.getByText('Custom Children')).toBeInTheDocument();
    expect(screen.queryByTestId('ockName')).not.toBeInTheDocument();
    expect(screen.queryByTestId('ockAvatar')).not.toBeInTheDocument();
  });

  it('should call onConnect callback and handle connection state changes', async () => {
    const onConnectMock = vi.fn();
    const mockUseAccount = vi.mocked(useAccount);
    const connectMock = vi.fn();

    // Start disconnected
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
      <ConnectWallet
        disconnectedLabel="Connect Wallet"
        onConnect={onConnectMock}
      />,
    );

    // Click connect button
    const button = screen.getByTestId('ockConnectButton');
    fireEvent.click(button);

    // Simulate successful connection
    const onSuccessCallback = connectMock.mock.calls[0][1].onSuccess;
    onSuccessCallback();

    // Update to connected state
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
      <ConnectWallet
        disconnectedLabel="Connect Wallet"
        onConnect={onConnectMock}
      />,
    );

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
    render(
      <ConnectWallet
        disconnectedLabel="Connect Wallet"
        onConnect={onConnectMock}
      />,
    );

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

      render(<ConnectWallet disconnectedLabel="Connect Wallet" />);

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

      render(<ConnectWallet disconnectedLabel="Connect Wallet" />);

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

  describe('connection state handling', () => {
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

      render(
        <ConnectWallet disconnectedLabel="Connect" onConnect={onConnectMock} />,
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
        <ConnectWallet
          disconnectedLabel="Connect Wallet"
          onConnect={onConnectMock}
        />,
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
        <ConnectWallet
          disconnectedLabel="Connect Wallet"
          onConnect={onConnectMock}
        />,
      );

      expect(onConnectMock).toHaveBeenCalledTimes(1);

      rerender(
        <ConnectWallet
          disconnectedLabel="Connect Wallet"
          onConnect={onConnectMock}
        />,
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

      render(<ConnectWallet disconnectedLabel="Connect Wallet" />);

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        WalletEvent.ConnectInitiated,
        {
          component: 'WalletModal',
        },
      );
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

      render(<ConnectWallet disconnectedLabel="Connect Wallet" />);

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        WalletEvent.ConnectSuccess,
        {
          address: '0x123',
          walletProvider: 'TestConnector',
        },
      );
    });
  });

  describe('render prop functionality', () => {
    const mockWalletContext = {
      breakpoint: 'md',
      isConnectModalOpen: false,
      setIsConnectModalOpen: vi.fn(),
      isSubComponentOpen: false,
      setIsSubComponentOpen: vi.fn(),
      isSubComponentClosing: false,
      setIsSubComponentClosing: vi.fn(),
      handleClose: vi.fn(),
      connectRef: { current: null },
      showSubComponentAbove: false,
      alignSubComponentRight: false,
      activeFeature: null,
      setActiveFeature: vi.fn(),
      isActiveFeatureClosing: false,
      setIsActiveFeatureClosing: vi.fn(),
      animations: {
        container: '',
        content: '',
      },
      isSponsored: false,
    } as unknown as WalletContextType;

    beforeEach(() => {
      vi.mocked(useWalletContext).mockReturnValue(mockWalletContext);
    });

    it('should use custom render function when provided and disconnected', () => {
      vi.mocked(useAccount).mockReturnValue({
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

      const customRender = vi.fn(
        ({ label, onClick, context, status, isLoading }) => {
          expect(context).toBe(mockWalletContext);
          expect(status).toBe('disconnected');
          expect(isLoading).toBe(false);
          return (
            <button data-testid="custom-disconnect-button" onClick={onClick}>
              Custom: {label}
            </button>
          );
        },
      );

      render(
        <ConnectWallet disconnectedLabel="Connect Now" render={customRender} />,
      );

      expect(customRender).toHaveBeenCalledWith({
        label: 'Connect Now',
        onClick: expect.any(Function),
        context: mockWalletContext,
        status: 'disconnected',
        isLoading: false,
      });
      expect(
        screen.getByTestId('custom-disconnect-button'),
      ).toBeInTheDocument();
      expect(screen.getByText('Custom: Connect Now')).toBeInTheDocument();
    });

    it('should use custom render function when provided and connecting', () => {
      vi.mocked(useAccount).mockReturnValue({
        address: undefined,
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

      const customRender = vi.fn(
        ({ label, onClick, context, status, isLoading }) => {
          expect(context).toBe(mockWalletContext);
          expect(status).toBe('connecting');
          expect(isLoading).toBe(true);
          return (
            <button data-testid="custom-connecting-button" onClick={onClick}>
              Custom: {label}
            </button>
          );
        },
      );

      render(
        <ConnectWallet disconnectedLabel="Connect Now" render={customRender} />,
      );

      expect(customRender).toHaveBeenCalledWith({
        label: expect.any(Object), // Spinner component
        onClick: expect.any(Function),
        context: mockWalletContext,
        status: 'connecting',
        isLoading: true,
      });
      expect(
        screen.getByTestId('custom-connecting-button'),
      ).toBeInTheDocument();
    });

    it('should use custom render function when provided and connected', () => {
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

      const customRender = vi.fn(({ onClick, context, status, isLoading }) => {
        expect(context).toBe(mockWalletContext);
        expect(status).toBe('connected');
        expect(isLoading).toBe(false);
        return (
          <button data-testid="custom-connected-button" onClick={onClick}>
            Custom: Connected
          </button>
        );
      });

      render(
        <ConnectWallet disconnectedLabel="Connect Now" render={customRender} />,
      );

      expect(customRender).toHaveBeenCalledWith({
        label: 'Connect Now',
        onClick: expect.any(Function),
        context: mockWalletContext,
        status: 'connected',
        isLoading: false,
      });
      expect(screen.getByTestId('custom-connected-button')).toBeInTheDocument();
    });

    it('should trigger onClick when custom rendered button is clicked (disconnected)', () => {
      const connectMock = vi.fn();

      vi.mocked(useAccount).mockReturnValue({
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

      render(
        <ConnectWallet
          disconnectedLabel="Connect Now"
          render={({ label, onClick }) => (
            <button data-testid="custom-click-button" onClick={onClick}>
              {label}
            </button>
          )}
        />,
      );

      fireEvent.click(screen.getByTestId('custom-click-button'));
      expect(connectMock).toHaveBeenCalled();
    });

    it('should show WalletModal when render prop is used in modal mode', () => {
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

      const setIsConnectModalOpenMock = vi.fn();
      vi.mocked(useWalletContext).mockReturnValue({
        ...mockWalletContext,
        isConnectModalOpen: true,
        setIsConnectModalOpen: setIsConnectModalOpenMock,
      });

      render(
        <ConnectWallet
          disconnectedLabel="Connect Now"
          render={({ label, onClick }) => (
            <button data-testid="modal-render-button" onClick={onClick}>
              {label}
            </button>
          )}
        />,
      );

      // Should render WalletModal when using render prop in modal mode
      expect(screen.getByTestId('modal-render-button')).toBeInTheDocument();
    });
  });

  describe('modal close functionality', () => {
    it('should call setIsConnectModalOpen(false) when modal is closed', () => {
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

      vi.mocked(useAccount).mockReturnValue({
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

      render(<ConnectWallet disconnectedLabel="Connect Wallet" />);

      // Get the modal and trigger the close function
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);

      expect(setIsConnectModalOpenMock).toHaveBeenCalledWith(false);
    });

    it('should call setIsConnectModalOpen(false) when render prop modal is closed', () => {
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

      vi.mocked(useAccount).mockReturnValue({
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

      render(
        <ConnectWallet
          disconnectedLabel="Connect Wallet"
          render={({ label, onClick }) => (
            <button data-testid="render-prop-button" onClick={onClick}>
              {label}
            </button>
          )}
        />,
      );

      // This should render the WalletModal within ConnectWalletRenderHandler
      // Get the modal and trigger the close function
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);

      expect(setIsConnectModalOpenMock).toHaveBeenCalledWith(false);
    });
  });

  describe('conditional WalletProvider wrapping', () => {
    afterEach(() => {
      // Clear the mock after each test
      (useContext as Mock).mockClear();
    });

    it('should NOT wrap with WalletProvider when context exists', () => {
      // This test ensures line 241 is covered - when wallet context exists,
      // ConnectWallet should NOT wrap with WalletProvider

      // Mock useContext to return a truthy wallet context (simulating existing provider)
      const mockWalletContext = {
        isSubComponentOpen: false,
        handleClose: vi.fn(),
        setIsSubComponentOpen: vi.fn(),
        breakpoint: 'md',
        isConnectModalOpen: false,
        setIsConnectModalOpen: vi.fn(),
        isSubComponentClosing: false,
      };

      (useContext as Mock).mockReturnValue(mockWalletContext);

      render(<ConnectWallet disconnectedLabel="Test Connect" />);

      // WalletProvider should NOT be rendered since context exists (line 241 path)
      const walletProvider = screen.queryByTestId('mocked-wallet-provider');
      expect(walletProvider).not.toBeInTheDocument();

      // Should render the connect button (via ConnectWalletContent directly)
      const button = screen.getByTestId('ockConnectButton');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Test Connect');
    });

    it('should wrap with WalletProvider when context is null', () => {
      // This test ensures lines 237-238 are covered - when wallet context is null,
      // ConnectWallet should auto-wrap with WalletProvider

      (useContext as Mock).mockReturnValue(null);

      render(<ConnectWallet disconnectedLabel="Test Auto Wrap" />);

      // WalletProvider SHOULD be rendered since no context exists (lines 237-238 path)
      const walletProvider = screen.getByTestId('mocked-wallet-provider');
      expect(walletProvider).toBeInTheDocument();

      // Should still render the connect button (inside the auto-wrapped provider)
      const button = screen.getByTestId('ockConnectButton');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Test Auto Wrap');
    });
  });
});
