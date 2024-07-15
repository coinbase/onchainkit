import { cn, text } from '../../styles/theme';
import { getSwapMessage } from '../core/getSwapMessage';
import type { SwapMessageReact } from '../types';
import { useSwapContext } from './SwapProvider';

export function SwapMessage({ className }: SwapMessageReact) {
  const { to, from, error, loading, isTransactionPending } = useSwapContext();

  const message = getSwapMessage({
    error,
    from,
    loading,
    isTransactionPending,
    to,
  });

  return (
    <div
      className={cn('flex pt-2', text.label2, className)}
      data-testid="ockSwapMessage_Message"
    >
      {message}
    </div>
  );
}
