'use client';
import { Avatar, Name } from '@/identity';
import { ReactNode, useCallback, useContext, useMemo } from 'react';
import { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { WalletEvent } from '@/core/analytics/types';
import { IdentityProvider } from '@/identity/components/IdentityProvider';
import { Spinner } from '@/internal/components/Spinner';
import { cn, pressable, text } from '../../styles/theme';
import { useOnchainKit } from '@/useOnchainKit';
import { WalletModal } from './WalletModal';
import {
  useWalletContext,
  WalletContext,
  WalletProvider,
  type WalletContextType,
} from './WalletProvider';
import { WithRenderProps } from '@/internal/types';
import { MiniKitContext } from '@/minikit/MiniKitProvider';
import { Button } from '@/ui/Button';
import { IfInMiniApp } from '@/minikit/components/IfInMiniApp';
import { useMiniKit } from '@/minikit';

export type ConnectWalletProps = WithRenderProps<{
  /** Children can be utilized to display customized content when the wallet is connected. */
  children?: ReactNode;
  /** Optional className override for button element */
  className?: string;
  /** Optional callback function to execute when the wallet is connected. */
  onConnect?: () => void;
  /** Optional disconnected display override */
  disconnectedLabel?: ReactNode;
  /** Custom render function for complete control of button rendering */
  render?: ({
    label,
    onClick,
    context,
    status,
    isLoading,
  }: {
    label: ReactNode;
    onClick: () => void;
    context: WalletContextType;
    status: 'disconnected' | 'connecting' | 'connected';
    isLoading: boolean;
  }) => ReactNode;
}>;

function MiniAppDefaultChildren() {
  const { context } = useMiniKit();

  return (
    <>
      <Avatar
        className="h-6 w-6"
        name={context?.user.displayName}
        avatar={context?.user.pfpUrl}
      />
      <Name name={context?.user.displayName} />
    </>
  );
}

function ConnectWalletContent({
  children = (
    <IfInMiniApp
      fallback={
        <>
          <Avatar className="h-6 w-6" />
          <Name />
        </>
      }
    >
      <MiniAppDefaultChildren />
    </IfInMiniApp>
  ),
  className,
  onConnect,
  disconnectedLabel = 'Connect Wallet',
  render,
}: ConnectWalletProps) {
  const { config = { wallet: { display: undefined } } } = useOnchainKit();
  const walletContext = useWalletContext();
  const {
    isConnectModalOpen,
    setIsConnectModalOpen,
    isSubComponentOpen,
    setIsSubComponentOpen,
    handleClose,
  } = walletContext;
  const {
    address: accountAddress,
    status,
    connector: accountConnector,
  } = useAccount();
  const { connectors, connect, status: connectStatus } = useConnect();
  const { sendAnalytics } = useAnalytics();
  const [hasClickedConnect, setHasClickedConnect] = useState(false);
  const miniKitContext = useContext(MiniKitContext);
  const isWalletModalEnabled = useMemo(() => {
    return config?.wallet?.display === 'modal' && !miniKitContext?.context;
  }, [config?.wallet?.display, miniKitContext?.context]);

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
    if (isWalletModalEnabled) {
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
    isWalletModalEnabled,
    connect,
    connector,
    handleAnalyticsError,
    handleAnalyticsSuccess,
    handleOpenConnectModal,
    onConnect,
    sendAnalytics,
  ]);

  const buttonContent = useMemo(() => {
    if (isLoading) return <Spinner />;

    if (status === 'disconnected') return disconnectedLabel;

    return (
      <div className="flex items-center justify-center gap-2">{children}</div>
    );
  }, [isLoading, status, disconnectedLabel, children]);

  if (render) {
    return (
      <ConnectWalletRenderHandler
        label={buttonContent}
        onClick={handleConnectClick}
        isLoading={isLoading}
        render={render}
        isWalletModalEnabled={isWalletModalEnabled}
      />
    );
  }

  if (status === 'disconnected') {
    return (
      <div className="flex" data-testid="ockConnectWallet_Container">
        <Button
          type="button"
          data-testid="ockConnectButton"
          className={cn('inline-flex min-w-[153px]', className)}
          onClick={handleConnectClick}
        >
          {buttonContent}
        </Button>
        {isWalletModalEnabled && (
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
            text.headline,
            'text-ock-foreground-inverse',
            'inline-flex min-w-[153px] items-center justify-center rounded-xl px-4 py-3',
            pressable.disabled,
            className,
          )}
          disabled={true}
        >
          {buttonContent}
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
            'text-ock-foreground',
            'px-4 py-3',
            isSubComponentOpen &&
              'bg-ock-secondary-active hover:bg-ock-secondary-active',
            className,
          )}
          onClick={handleToggle}
        >
          <div className="flex items-center justify-center gap-2">
            {children}
          </div>
        </button>
      </div>
    </IdentityProvider>
  );
}

function ConnectWalletRenderHandler({
  label,
  onClick,
  isLoading,
  render,
  isWalletModalEnabled,
}: {
  label: ReactNode;
  onClick: () => void;
  isLoading: boolean;
  render: NonNullable<ConnectWalletProps['render']>;
  isWalletModalEnabled: boolean;
}) {
  const walletContext = useWalletContext();
  const { isConnectModalOpen, setIsConnectModalOpen } = walletContext;
  const { status, address } = useAccount();

  if (status === 'disconnected') {
    return (
      <>
        {render({
          label,
          onClick,
          context: walletContext,
          status: 'disconnected',
          isLoading,
        })}
        {isWalletModalEnabled && (
          <WalletModal
            isOpen={isConnectModalOpen}
            onClose={() => setIsConnectModalOpen(false)}
          />
        )}
      </>
    );
  }

  if (isLoading) {
    return render({
      label: <Spinner />,
      onClick,
      context: walletContext,
      status: 'connecting',
      isLoading,
    });
  }

  return (
    <IdentityProvider address={address}>
      {render({
        label,
        onClick,
        context: walletContext,
        status: 'connected',
        isLoading,
      })}
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
