import { background, cn, text } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { DEFAULT_MAX_SLIPPAGE } from '../constants';
import { useSwapComponents } from '../hooks/useSwapComponents';
import type { SwapReact } from '../types';
import { SwapProvider } from './SwapProvider';

export function Swap({
  children,
  config = {
    maxSlippage: DEFAULT_MAX_SLIPPAGE,
  },
  className,
  experimental = { useAggregator: false },
  swappableTokens,
  fromToken,
  toToken,
  onError,
  onStatus,
  onSuccess,
  title = 'Swap',
}: SwapReact) {
  const { inputs, toggleButton, swapButton, swapMessage, swapSettings } =
    useSwapComponents({ children, swappableTokens, fromToken, toToken });

  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }
  return (
    <SwapProvider
      config={config}
      experimental={experimental}
      onError={onError}
      onStatus={onStatus}
      onSuccess={onSuccess}
    >
      <div
        className={cn(
          background.default,
          'flex w-[500px] flex-col rounded-xl px-6 pt-6 pb-4',
          className,
        )}
        data-testid="ockSwap_Container"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3
            className={cn(text.title3, 'text-inherit')}
            data-testid="ockSwap_Title"
          >
            {title}
          </h3>
          {swapSettings}
        </div>
        {inputs[0]}
        <div className="relative h-1">{toggleButton}</div>
        {inputs[1]}
        {swapButton}
        <div className="flex">{swapMessage}</div>
      </div>
    </SwapProvider>
  );
}
