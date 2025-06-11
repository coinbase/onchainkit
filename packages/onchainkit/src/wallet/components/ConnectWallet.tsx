'use client';
import { Avatar, Name } from '@/identity';
import { useCallback, useContext } from 'react';
import { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { WalletEvent } from '@/core/analytics/types';
import { IdentityProvider } from '@/identity/components/IdentityProvider';
import { Spinner } from '@/internal/components/Spinner';
import { cn, text as dsText, pressable } from '@/styles/theme';
import { useOnchainKit } from '@/useOnchainKit';
import type { ConnectWalletProps } from '../types';
import { WalletModal } from './WalletModal';
import {
  useWalletContext,
  WalletContext,
  WalletProvider,
} from './WalletProvider';

const connectWalletDefaultChildren = (
  <>
    <Avatar className="h-6 w-6" />
    <Name />
  </>
);

function ConnectWalletContent({
  children,
  className,
  onConnect,
  disconnectedLabel = 'Connect Wallet',
}: ConnectWalletProps) {
  const { config = { wallet: { display: undefined } } } = useOnchainKit();
  const {
    isConnectModalOpen,
    setIsConnectModalOpen,
    isSubComponentOpen,
    setIsSubComponentOpen,
    handleClose,
  } = useWalletContext();
  const {
    address: accountAddress,
    status,
    connector: accountConnector,
  } = useAccount();
  const { connectors, connect, status: connectStatus } = useConnect();
  const { sendAnalytics } = useAnalytics();

  const [hasClickedConnect, setHasClickedConnect] = useState(false);

  const connector = accountConnector || connectors[0];
  const isLoading = connectStatus === 'pending' || status === 'connecting';

  const handleToggle = useCallback(() => {
    if (isSubComponentOpen) {
      handleClose();
    } else {
      setIsSubComponentOpen(true);
    }
  }, [isSubComponentOpen, handleClose, setIsSubComponentOpen]);

  const handleCloseConnectModal = useCallback(() => {
    setIsConnectModalOpen(false);
  }, [setIsConnectModalOpen]);

  const handleOpenConnectModal = useCallback(() => {
    setIsConnectModalOpen(true);
    setHasClickedConnect(true);
  }, [setIsConnectModalOpen]);

  const handleAnalyticsSuccess = useCallback(() => {
    if (!accountAddress || !connector) return;

    sendAnalytics(WalletEvent.ConnectSuccess, {
      address: accountAddress,
      walletProvider: connector?.name,
    });
  }, [sendAnalytics, connector, accountAddress]);

  const handleAnalyticsError = useCallback(
    (errorMessage: string, component: string) => {
      const walletProvider = connector?.name;
      sendAnalytics(WalletEvent.ConnectError, {
        error: errorMessage,
        metadata: {
          connector: walletProvider,
          component,
        },
      });
    },
    [sendAnalytics, connector],
  );

  useEffect(() => {
    if (status !== 'connected') return;

    if (hasClickedConnect && onConnect) {
      onConnect();
      setHasClickedConnect(false);
    }

    handleAnalyticsSuccess();
  }, [
    status,
    hasClickedConnect,
    onConnect,
    accountAddress,
    connector,
    handleAnalyticsSuccess,
  ]);

  const handleConnectClick = useCallback(() => {
    if (config?.wallet?.display === 'modal') {
      handleOpenConnectModal();
      setHasClickedConnect(true);
      sendAnalytics(WalletEvent.ConnectInitiated, {
        component: 'WalletModal',
      });
      return;
    }

    sendAnalytics(WalletEvent.ConnectInitiated, {
      component: 'ConnectWallet',
    });
    connect(
      { connector },
      {
        onSuccess: () => {
          onConnect?.();
          handleAnalyticsSuccess();
        },
        onError: (error) => {
          handleAnalyticsError(error.message, 'ConnectWallet');
        },
      },
    );
  }, [
    config?.wallet?.display,
    connect,
    connector,
    handleAnalyticsError,
    handleAnalyticsSuccess,
    handleOpenConnectModal,
    onConnect,
    sendAnalytics,
  ]);

  if (status === 'disconnected') {
    return (
      <div className="flex" data-testid="ockConnectWallet_Container">
        <button
          type="button"
          data-testid="ockConnectButton"
          className={cn(
            pressable.primary,
            'rounded-ock-default',
            dsText.headline,
            'text-ock-text-inverse',
            'inline-flex min-w-[153px] items-center justify-center px-4 py-3',
            className,
          )}
          onClick={handleConnectClick}
        >
          {disconnectedLabel}
        </button>
        {config?.wallet?.display === 'modal' && (
          <WalletModal
            isOpen={isConnectModalOpen}
            onClose={handleCloseConnectModal}
          />
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex" data-testid="ockConnectWallet_Container">
        <button
          type="button"
          data-testid="ockConnectAccountButtonInner"
          className={cn(
            pressable.primary,
            dsText.headline,
            'text-ock-text-inverse',
            'inline-flex min-w-[153px] items-center justify-center rounded-xl px-4 py-3',
            pressable.disabled,
            className,
          )}
          disabled={true}
        >
          <Spinner />
        </button>
      </div>
    );
  }

  return (
    <IdentityProvider address={accountAddress}>
      <div className="flex gap-4" data-testid="ockConnectWallet_Container">
        <button
          type="button"
          data-testid="ockConnectWallet_Connected"
          className={cn(
            pressable.secondary,
            'rounded-ock-default',
            'text-ock-text-foreground',
            'px-4 py-3',
            isSubComponentOpen &&
              'ock-bg-secondary-active hover:ock-bg-secondary-active',
            className,
          )}
          onClick={handleToggle}
        >
          <div className="flex items-center justify-center gap-2">
            {children || connectWalletDefaultChildren}
          </div>
        </button>
      </div>
    </IdentityProvider>
  );
}

export function ConnectWallet(props: ConnectWalletProps) {
  // Using `useContext` because `useWalletContext` will throw if there is no
  // Provider up the tree.
  const walletContext = useContext(WalletContext);

  if (!walletContext) {
    return (
      <WalletProvider>
        <ConnectWalletContent {...props} />
      </WalletProvider>
    );
  }

  return <ConnectWalletContent {...props} />;
}
