import { useSwapContext } from '../context';
import { text } from '../../styles/theme';
import { getSwapMessage } from '../core/getSwapMessage';

export function SwapMessage() {
  const {
    error,
    convertedFromTokenBalance,
    fromAmount,
    fromToken,
    swapErrorState,
    swapLoadingState,
    toAmount,
    toToken,
  } = useSwapContext();

  const message = getSwapMessage({
    error,
    convertedFromTokenBalance,
    fromAmount,
    fromToken,
    swapErrorState,
    swapLoadingState,
    toAmount,
    toToken,
  });

  return (
    <div className="flex">
      <span className={text.label2} data-testid="ockSwapMessage_Message">
        {message}
      </span>
    </div>
  );
}
