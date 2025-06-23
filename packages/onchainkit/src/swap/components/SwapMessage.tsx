'use client';
import { cn, text } from '@/styles/theme';
import type { SwapMessageProps } from '../types';
import { getSwapMessage } from '../utils/getSwapMessage';
import { useSwapContext } from './SwapProvider';

export function SwapMessage({ className, render }: SwapMessageProps) {
  const { address, to, from, lifecycleStatus } = useSwapContext();

  const message = getSwapMessage({
    address,
    from,
    lifecycleStatus,
    to,
  });

  if (render) {
    return render({ message: message || null });
  }

  return (
    <div
      className={cn(
        'flex h-7 pt-2',
        text.label2,
        'text-foreground-muted',
        className,
      )}
      data-testid="ockSwapMessage_Message"
    >
      {message}
    </div>
  );
}
