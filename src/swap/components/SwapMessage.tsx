import { useSwapContext } from '../context';
import { text } from '../../styles/theme';
import { getSwapMessage } from '../core/getSwapMessage';

export function SwapMessage() {
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
      <span className={text.label2} data-testid="ockSwapMessage_Message">
        {message}
      </span>
    </div>
  );
}
