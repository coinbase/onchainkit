'use client';

import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';
import { disconnectSvg } from '../../internal/svg/disconnectSvg';
import { cn, color, text as dsText, pressable } from '../../styles/theme';
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
        color.foreground,
        'relative flex w-full items-center px-4 pt-3 pb-4',
        className,
      )}
      onClick={handleDisconnect}
    >
      <div className="absolute left-4 flex h-[1.125rem] w-[1.125rem] items-center justify-center">
        {disconnectSvg}
      </div>
      <span className={cn(dsText.body, 'pl-6')}>{text}</span>
    </button>
  );
}
