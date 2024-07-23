import { useCallback } from 'react';
import { useConnect, useDisconnect } from 'wagmi';
import { disconnectSvg } from '../../internal/svg/disconnectSvg';
import { cn, text as dsText, pressable } from '../../styles/theme';
import type { WalletDropdownDisconnectReact } from '../types';

export function WalletDropdownDisconnect({
  className,
  text = 'Disconnect',
}: WalletDropdownDisconnectReact) {
  const { connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[0];

  const handleDisconnect = useCallback(() => {
    disconnect({ connector });
  }, [connector, disconnect]);

  return (
    <button
      type="button"
      className={cn(
        pressable.default,
        'flex items-center gap-2 px-4 py-2',
        className,
      )}
      onClick={handleDisconnect}
    >
      <div className="w-5">{disconnectSvg}</div>
      <span className={cn(dsText.body, 'shrink-0')}>{text}</span>
    </button>
  );
}
