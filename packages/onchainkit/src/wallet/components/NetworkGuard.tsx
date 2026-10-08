'use client';

import { useCallback } from 'react';
import { useNetworkGuard } from '../hooks/useNetworkGuard';
import { cn, text, border, pressable } from '@/styles/theme';

export function NetworkGuard({ className }: { className?: string }) {
  const { isWrongNetwork, isSwitching, targetChain, switchNetwork } = useNetworkGuard();

  const handleSwitch = useCallback(async () => {
    await switchNetwork();
  }, [switchNetwork]);

  if (!isWrongNetwork) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-3',
        'bg-warning text-warning-foreground',
        border.radius,
        className,
      )}
      data-testid="ock-network-guard"
    >
      <span className={cn(text.label2)}>
        Wrong network. Please switch to {targetChain.name}.
      </span>
      <button
        type="button"
        onClick={handleSwitch}
        disabled={isSwitching}
        className={cn(
          pressable.primary,
          border.radius,
          'px-3 py-1.5 text-sm font-medium',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
        data-testid="ock-network-guard-switch"
      >
        {isSwitching ? 'Switching...' : `Switch to ${targetChain.name}`}
      </button>
    </div>
  );
}
