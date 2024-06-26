import { getSwapMessage } from '../core/getSwapMessage';
import { cn, text } from '../../styles/theme';
import { useSwapContext } from './SwapProvider';
import type { SwapMessageReact } from '../types';

export function SwapMessage({ className }: SwapMessageReact) {
  const { to, from, error, loading } = useSwapContext();

  const message = getSwapMessage({
    error,
    from,
    loading,
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
