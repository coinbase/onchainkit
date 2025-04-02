'use client';

import { Avatar, Name } from '@/identity';
import { Children, isValidElement, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { WalletEvent } from '../../core/analytics/types';
import { IdentityProvider } from '../../identity/components/IdentityProvider';
import { Spinner } from '../../internal/components/Spinner';
import { findComponent } from '../../internal/utils/findComponent';
import {
  border,
  cn,
  color,
  text as dsText,
  pressable,
} from '../../styles/theme';
import { useOnchainKit } from '../../useOnchainKit';
import type { ConnectWalletReact } from '../types';
import { ConnectButton } from './ConnectButton';
import { ConnectWalletText } from './ConnectWalletText';
import { WalletModal } from './WalletModal';
import { useWalletContext } from './WalletProvider';

const connectWalletDefaultChildren = (
  <>
    <Avatar className="h-6 w-6" />
    <Name />
  </>
);

export function ConnectWallet({
  children,
  className,
  // In a few version we will officially deprecate this prop,
  // but for now we will keep it for backward compatibility.
  text = 'Connect Wallet',
  onConnect,
  disconnectedLabel,
}: ConnectWalletReact) {
  const { config = { wallet: { display: undefined } } } = useOnchainKit();

  // Core Hooks
  const {
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

  // State
  const [hasClickedConnect, setHasClickedConnect] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // duplicate modal state because ConnectWallet not always within WalletProvider

  // TODO: remove lines 57-74 after deprecating ConnectWalletText
  // Get connectWalletText from children when present,
  // this is used to customize the connect wallet button text
  const { connectWalletText } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      connectWalletText: childrenArray.find(findComponent(ConnectWalletText)),
    };
  }, [children]);

  // Remove connectWalletText from children if present
  const childrenWithoutConnectWalletText = useMemo(() => {
    return Children.map(children, (child: ReactNode) => {
      if (isValidElement(child) && child.type === ConnectWalletText) {
        return null;
      }
      return child;
    });
  }, [children]);

  // Wallet connect status
  const connector = accountConnector || connectors[0];
  const isLoading = connectStatus === 'pending' || status === 'connecting';

  // Handles
  const handleToggle = useCallback(() => {
    if (isSubComponentOpen) {
      handleClose?.(); // optional because ConnectWallet not always within WalletProvider
    } else {
      setIsSubComponentOpen(true);
    }
  }, [isSubComponentOpen, handleClose, setIsSubComponentOpen]);

  const handleCloseConnectModal = useCallback(() => {
    setIsModalOpen(false); // duplicate state because ConnectWallet not always within WalletProvider
    setIsConnectModalOpen?.(false); // optional because ConnectWallet not always within WalletProvider
  }, [setIsConnectModalOpen]);

  const handleOpenConnectModal = useCallback(() => {
    setIsModalOpen(true); // duplicate state because ConnectWallet not always within WalletProvider
    setIsConnectModalOpen?.(true); // optional because ConnectWallet not always within WalletProvider
    setHasClickedConnect(true);
  }, [setIsConnectModalOpen]);

  const handleAnalyticsInitiated = useCallback(
    (component: string) => {
      sendAnalytics(WalletEvent.ConnectInitiated, {
        component,
      });
    },
    [sendAnalytics],
  );

  const handleAnalyticsSuccess = useCallback(
    (walletAddress: string | undefined) => {
      const walletProvider = connector?.name;
      sendAnalytics(WalletEvent.ConnectSuccess, {
        address: walletAddress ?? '',
        walletProvider,
      });
    },
    [sendAnalytics, connector],
  );

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

  // Effects
  useEffect(() => {
    if (hasClickedConnect && status === 'connected' && onConnect) {
      onConnect();
      setHasClickedConnect(false);
    }
  }, [status, hasClickedConnect, onConnect]);

  useEffect(() => {
    if (status === 'connected' && accountAddress && connector) {
      handleAnalyticsSuccess(accountAddress);
    }
  }, [status, accountAddress, connector, handleAnalyticsSuccess]);

  const handleConnectClick = useCallback(() => {
    if (config?.wallet?.display === 'modal') {
      handleOpenConnectModal();
      setHasClickedConnect(true);
      handleAnalyticsInitiated('WalletModal');
      return;
    }
    handleAnalyticsInitiated('ConnectWallet');
    connect(
      { connector },
      {
        onSuccess: () => {
          onConnect?.();
          handleAnalyticsSuccess(accountAddress);
        },
        onError: (error) => {
          handleAnalyticsError(error.message, 'ConnectWallet');
        },
      },
    );
  }, [
    config?.wallet?.display,
    accountAddress,
    connect,
    connector,
    handleAnalyticsError,
    handleAnalyticsInitiated,
    handleAnalyticsSuccess,
    handleOpenConnectModal,
    onConnect,
  ]);

  if (status === 'disconnected') {
    return (
      <div className="flex" data-testid="ockConnectWallet_Container">
        <ConnectButton
          className={className}
          connectWalletText={connectWalletText || disconnectedLabel}
          onClick={handleConnectClick}
          text={text}
        />
        {config?.wallet?.display === 'modal' && (
          <WalletModal isOpen={isModalOpen} onClose={handleCloseConnectModal} />
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
            color.inverse,
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
            border.radius,
            color.foreground,
            'px-4 py-3',
            isSubComponentOpen &&
              'ock-bg-secondary-active hover:ock-bg-secondary-active',
            className,
          )}
          onClick={handleToggle}
        >
          <div className="flex items-center justify-center gap-2">
            {childrenWithoutConnectWalletText || connectWalletDefaultChildren}
          </div>
        </button>
      </div>
    </IdentityProvider>
  );
}
