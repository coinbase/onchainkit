import { useSwapContext } from '../context';
import { text, cn } from '../../styles/theme';
import { getSwapMessage } from '../core/getSwapMessage';
import type { SwapMessageReact } from '../types'

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
    <div className="flex pt-2">
      <span className={cn(
        text.label2,
        className
      )} data-testid="ockSwapMessage_Message">
        {message}
      </span>
    </div>
  );
}
