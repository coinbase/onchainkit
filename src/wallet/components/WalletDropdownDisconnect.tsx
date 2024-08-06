import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';
import { disconnectSvg } from '../../internal/svg/disconnectSvg';
import { cn, text as dsText, pressable } from '../../styles/theme';
import type { WalletDropdownDisconnectReact } from '../types';

export function WalletDropdownDisconnect({
  className,
  text = 'Disconnect',
}: WalletDropdownDisconnectReact) {
  const { disconnect, connectors } = useDisconnect();
  const handleDisconnect = useCallback(() => {
    // Disconnect all the connectors (wallets). Usually only one is connected
    connectors.map((connector) => disconnect({ connector }));
  }, [disconnect, connectors]);

  return (
    <button
      type="button"
      className={cn(
        pressable.default,
        'relative flex items-center px-4 py-3',
        className,
      )}
      onClick={handleDisconnect}
    >
      <div className="-translate-y-1/2 absolute top-1/2 left-4 flex h-5 w-5 items-center justify-center">
        {disconnectSvg}
      </div>
      <span className={cn(dsText.body, 'pl-[1.8125rem]')}>{text}</span>
    </button>
  );
}
