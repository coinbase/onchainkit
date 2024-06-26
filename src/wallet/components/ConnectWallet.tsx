import { type ReactNode, useCallback, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import type { ConnectAccountReact as ConnectWalletReact } from '../types';
import { background, cn, color, pressable, text } from '../../styles/theme';
import { Address, Avatar, Badge, Identity, Name } from '../../identity';
import { useOnchainKit } from '../../useOnchainKit';
import { Spinner } from '../../internal/loading/Spinner';
import { walletSvg } from './walletSvg';
import { disconnectSvg } from './disconnectSvg';
import { IdentityProvider } from '../../identity/components/IdentityProvider';
import { useWalletContext } from './WalletProvider';

function ConnectedDropdownContent() {
  const { schemaId } = useOnchainKit();
  const { address } = useAccount();
  const { connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[0];

  const handleDisconnect = useCallback(() => {
    disconnect({ connector });
  }, [connector, disconnect]);

  if (!address) {
    return null;
  }

  return (
    <div
      className={cn(
        background.default,
        'absolute right-0 z-10 mt-1 flex w-max min-w-[250px] flex-col overflow-hidden rounded-xl',
      )}
    >
      <Identity
        address={address}
        className={cn(pressable.default, 'px-5 pb-3 pt-2')}
        schemaId={schemaId}
      >
        <Avatar />
        <Name>
          <Badge />
        </Name>
        <Address className={color.foregroundMuted} />
      </Identity>
      <a
        className={cn(pressable.default, 'flex items-center gap-2 px-4 py-2')}
        target="_blank"
        href="https://wallet.coinbase.com"
        rel="noreferrer"
      >
        <div className="w-5">{walletSvg}</div>
        <span className={cn(text.body, 'shrink-0')}>
          Go to Wallet Dashboard
        </span>
      </a>
      <button
        type="button"
        className={cn(
          pressable.default,
          'flex items-center gap-2 px-4 pt-2 pb-3',
        )}
        onClick={handleDisconnect}
      >
        <div className="w-5">{disconnectSvg}</div>
        <span className={cn(text.body, 'shrink-0')}>Disconnect</span>
      </button>
    </div>
  );
}

type ConnectedWalletReact = {
  override: ReactNode;
};

function Connected({ override }: ConnectedWalletReact) {
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useAccount();

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  if (!address) return null;

  return (
    <div className="relative shrink-0 w-fit">
      <button
        type="button"
        className={cn(
          pressable.secondary,
          'rounded-xl px-4 py-3',
          isOpen && 'bg-secondary-active',
        )}
        onClick={handleToggle}
      >
        <div className="flex gap-2">
          <Avatar address={address} className="h-6 w-6" />
          <Name address={address} />
        </div>
      </button>
      {isOpen && (override || <ConnectedDropdownContent />)}
    </div>
  );
}

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
  const isLoading = connectStatus === 'pending';

  if (status === 'disconnected' || status === 'connecting') {
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
