import {
  ConnectButton as ConnectButtonRainbowKit,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { Children, isValidElement, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useAccount, useConnect } from 'wagmi';
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
import type { ConnectWalletReact } from '../types';
import { ConnectButton } from './ConnectButton';
import { ConnectWalletText } from './ConnectWalletText';
import { useWalletContext } from './WalletProvider';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';

export function ConnectWallet({
  children,
  className,
  // In a few version we will officially deprecate this prop,
  // but for now we will keep it for backward compatibility.
  text = 'Connect Wallet',
  withWalletAggregator = false,
  onConnect,
}: ConnectWalletReact) {
  // Core Hooks
  const { isOpen, setIsOpen } = useWalletContext();
  const { address: accountAddress, status } = useAccount();
  const { connectors, connect, status: connectStatus } = useConnect();

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
  const connector = connectors[0];
  const isLoading = connectStatus === 'pending' || status === 'connecting';

  // Handles
  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  if (status === 'disconnected') {
    if (withWalletAggregator) {
      return (
        <RainbowKitSiweNextAuthProvider>
          <RainbowKitProvider>
            <ConnectButtonRainbowKit.Custom>
              {({ openConnectModal }) => (
                <div className="flex" data-testid="ockConnectWallet_Container">
                  <ConnectButton
                    className={className}
                    connectWalletText={connectWalletText}
                    onClick={() => openConnectModal()}
                    text={text}
                  />
                </div>
              )}
            </ConnectButtonRainbowKit.Custom>
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      );
    }
    return (
      <div className="flex" data-testid="ockConnectWallet_Container">
        <ConnectButton
          className={className}
          connectWalletText={connectWalletText}
          onClick={() => connect({ connector }, { onSuccess: onConnect })}
          text={text}
        />
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
            isOpen && 'ock-bg-secondary-active hover:ock-bg-secondary-active',
            className,
          )}
          onClick={handleToggle}
        >
          <div className="flex gap-2">{childrenWithoutConnectWalletText}</div>
        </button>
      </div>
    </IdentityProvider>
  );
}
