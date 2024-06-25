import { useSwapContext } from '../context';
import { text, cn } from '../../styles/theme';
import { getSwapMessage } from '../core/getSwapMessage';
import type { SwapMessageReact } from '../types';

export function SwapMessage({ className }: SwapMessageReact) {
  const {
    convertedFromTokenBalance,
    fromAmount,
    fromToken,
    swapErrorState,
    swapLoadingState,
    toAmount,
    toToken,
  } = useSwapContext();

  const message = getSwapMessage({
    convertedFromTokenBalance,
    fromAmount,
    fromToken,
    swapErrorState,
    swapLoadingState,
    toAmount,
    toToken,
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
