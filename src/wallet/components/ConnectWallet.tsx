import { ReactNode, useCallback, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import type { ConnectAccountReact as ConnectWalletReact } from '../types';
import { background, cn, color, pressable, text } from '../../styles/theme';
import { Address, Avatar, Badge, Identity, Name } from '../../identity';
import { useOnchainKit } from '../../useOnchainKit';
import { Spinner } from '../../internal/loading/Spinner';
import { walletSvg } from './walletSvg';
import { disconnectSvg } from './disconnectSvg';

type ConnectedWalletReact = {
  override: ReactNode;
};

function ConnectedWallet({ override }: ConnectedWalletReact) {
  const { schemaId } = useOnchainKit();
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useAccount();
  const { connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[0];

  const handleDisconnectWallet = useCallback(() => {
    disconnect({ connector });
  }, [connector, disconnect]);

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  if (!address) return null;

  const dropdownContent = override ?? (
    <div
      className={cn(
        background.default,
        'absolute right-0 z-10 mt-1 flex flex-col rounded-xl w-max min-w-[250px] overflow-hidden',
      )}
    >
      <Identity
        address={address}
        className={cn(pressable.default, 'rounded-xl px-4 py-2')}
        schemaId={schemaId}
      >
        <Avatar />
        <Name>
          <Badge />
        </Name>
        <Address />
      </Identity>
      <a
        className={cn(pressable.default, 'flex gap-2 items-center px-4 py-2')}
        target="_blank"
        href="https://wallet.coinbase.com"
      >
        <div className="w-5">{walletSvg}</div>
        <span className={cn(text.body, 'shrink-0')}>
          Go to Wallet Dashboard
        </span>
      </a>
      <div
        className={cn(pressable.default, 'flex gap-2 items-center px-4 py-2')}
        onClick={handleDisconnectWallet}
      >
        <div className="w-5">{disconnectSvg}</div>
        <span className={cn(text.body, 'shrink-0')}>Disconnect</span>
      </div>
    </div>
  );

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        className={cn(
          pressable.secondary,
          'px-4 py-3 rounded-xl',
          isOpen && 'bg-secondary-active',
        )}
        onClick={handleToggle}
      >
        <div className="flex gap-2">
          <Avatar address={address} className="h-6 w-6" />
          <Name address={address} />
        </div>
      </button>
      {isOpen && dropdownContent}
    </div>
  );
}

export function ConnectWallet({
  label = 'Connect Wallet',
  children,
}: ConnectWalletReact) {
  const { status } = useAccount();
  const { connectors, connect, status: connectStatus } = useConnect();
  const connector = connectors[0];
  const isLoading = connectStatus === 'pending';

  if (status === 'disconnected' || status === 'connecting') {
    return (
      <div className="flex" data-testid="ockConnectAccount_Container">
        <button
          type="button"
          data-testid="ockConnectAccountButtonInner"
          className={cn(
            pressable.primary,
            text.headline,
            color.inverse,
            'inline-flex items-center justify-center rounded-xl px-4 py-3 min-w-[153px]',
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
      <div className="flex" data-testid="ockConnectAccount_Container">
        <button
          type="button"
          data-testid="ockConnectAccountButtonInner"
          className={cn(
            pressable.primary,
            text.headline,
            color.inverse,
            'inline-flex items-center justify-center rounded-xl px-4 py-3 min-w-[153px]',
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
    <div className="flex" data-testid="ockConnectAccount_Container">
      <ConnectedWallet override={children} />
    </div>
  );
}
