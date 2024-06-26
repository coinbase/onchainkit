import { useConnect, useDisconnect } from 'wagmi';
import { cn, pressable, text } from '../../styles/theme';
import { disconnectSvg } from './disconnectSvg';
import { useCallback } from 'react';

export function WalletDisconnect() {
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
        'flex items-center gap-2 px-4 pt-2 pb-3',
      )}
      onClick={handleDisconnect}
    >
      <div className="w-5">{disconnectSvg}</div>
      <span className={cn(text.body, 'shrink-0')}>Disconnect</span>
    </button>
  );
}
