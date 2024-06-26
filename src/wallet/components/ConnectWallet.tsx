import { useCallback } from 'react';
import { useAccount, useConnect } from 'wagmi';
import type { ConnectAccountReact as ConnectWalletReact } from '../types';
import { cn, color, pressable, text } from '../../styles/theme';
import { Spinner } from '../../internal/loading/Spinner';
import { IdentityProvider } from '../../identity/components/IdentityProvider';
import { useWalletContext } from './WalletProvider';

export function ConnectWallet({
  label = 'Connect Wallet',
  children,
}: ConnectWalletReact) {
  const { isOpen, setIsOpen } = useWalletContext();
  const { address, status } = useAccount();
  const { connectors, connect, status: connectStatus } = useConnect();
  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const connector = connectors[0];
  const isLoading = connectStatus === 'pending' || status === 'connecting';

  if (status === 'disconnected') {
    return (
      <div className="flex" data-testid="ockConnectWallet_Container">
        <button
          type="button"
          data-testid="ockConnectWallet_ConnectButton"
          className={cn(
            pressable.primary,
            text.headline,
            color.inverse,
            'inline-flex min-w-[153px] items-center justify-center rounded-xl px-4 py-3',
          )}
          onClick={() => connect({ connector })}
        >
          <span className={cn(text.body, color.inverse)}>{label}</span>
        </button>
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
            color.inverse,
            'inline-flex min-w-[153px] items-center justify-center rounded-xl px-4 py-3',
            pressable.disabled,
          )}
          disabled
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
            isOpen && 'bg-secondary-active',
          )}
          onClick={handleToggle}
        >
          <div className="flex gap-2">{children}</div>
        </button>
      </div>
    </IdentityProvider>
  );
}
