import { ConnectButton as ConnectButtonRainboKit } from '@rainbow-me/rainbowkit';
import { useCallback } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { IdentityProvider } from '../../identity/components/IdentityProvider';
import { Spinner } from '../../internal/components/Spinner';
import { cn, color, text as dsText, pressable } from '../../styles/theme';
import type { ConnectWalletReact } from '../types';
import { ConnectButton } from './ConnectButton';
import { useWalletContext } from './WalletProvider';

export function ConnectWallet({
  children,
  className,
  text = 'Connect Wallet',
  withWalletAggregator = false,
}: ConnectWalletReact) {
  const { isOpen, setIsOpen } = useWalletContext();
  const { address, status } = useAccount();
  const { connectors, connect, status: connectStatus } = useConnect();
  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);
  const connector = connectors[0];
  const isLoading = connectStatus === 'pending' || status === 'connecting';

  if (status === 'disconnected') {
    if (withWalletAggregator) {
      return (
        <ConnectButtonRainboKit.Custom>
          {({ openConnectModal }) => (
            <div className="flex" data-testid="ockConnectWallet_Container">
              <ConnectButton
                className={className}
                connectButtonOnClick={() => openConnectModal()}
                text={text}
              />
            </div>
          )}
        </ConnectButtonRainboKit.Custom>
      );
    }
    return (
      <div className="flex" data-testid="ockConnectWallet_Container">
        <ConnectButton
          className={className}
          connectButtonOnClick={() => connect({ connector })}
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
    <IdentityProvider address={address}>
      <div className="flex gap-4" data-testid="ockConnectWallet_Container">
        <button
          type="button"
          data-testid="ockConnectWallet_Connected"
          className={cn(
            pressable.secondary,
            'rounded-xl px-4 py-3',
            isOpen && 'bg-ock-secondary-active hover:bg-ock-secondary-active',
            className,
          )}
          onClick={handleToggle}
        >
          <div className="flex gap-2">{children}</div>
        </button>
      </div>
    </IdentityProvider>
  );
}
