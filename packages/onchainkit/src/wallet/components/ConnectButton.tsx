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
  // Text will be deprecated in the future
  text,
}: ConnectButtonReact) {
  return (
    <button
      type="button"
      data-testid="ockConnectButton"
      className={cn(
        pressable.primary,
        border.radius,
        dsText.headline,
        color.inverse,
        'inline-flex min-w-[153px] items-center justify-center px-4 py-3',
        className,
      )}
      onClick={onClick}
    >
      {connectWalletText ? (
        connectWalletText
      ) : (
        <span className={cn(color.inverse)}>{text}</span>
      )}
    </button>
  );
}
