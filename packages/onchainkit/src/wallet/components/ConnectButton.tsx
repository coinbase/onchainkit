'use client';

import {
  border,
  cn,
  color,
  text as dsText,
  pressable,
} from '../../styles/theme';
import type { ConnectButtonReact } from '../types';

export function ConnectButton({
  className,
  connectWalletText,
  onClick,
}: ConnectButtonReact) {
  return (
    <button
      type="button"
      data-testid="ockConnectButton"
      className={cn(
        pressable.primary,
        'rounded-ock-default',
        dsText.headline,
        'text-ock-text-inverse',
        'inline-flex min-w-[153px] items-center justify-center px-4 py-3',
        className,
      )}
      onClick={onClick}
    >
      {connectWalletText}
    </button>
  );
}
