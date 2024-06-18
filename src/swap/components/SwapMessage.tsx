import { useSwapContext } from '../context';
import { text } from '../../styles/theme';
import { getSwapMessage } from '../core/getSwapMessage';

export function SwapMessage() {
  const {
    error,
    fromAmount,
    fromToken,
    fromTokenBalance,
    isLoading,
    toAmount,
    toToken,
  } = useSwapContext();

  const message = getSwapMessage({
    error,
    fromAmount,
    fromToken,
    fromTokenBalance,
    isLoading,
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
