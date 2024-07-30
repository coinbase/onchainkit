import { Children, useMemo } from 'react';
import { background, cn, text } from '../../styles/theme';
import type { SwapReact } from '../types';
import { SwapAmountInput } from './SwapAmountInput';
import { SwapButton } from './SwapButton';
import { SwapMessage } from './SwapMessage';
import { SwapProvider } from './SwapProvider';
import { SwapToggleButton } from './SwapToggleButton';

// istanbul ignore next
export function Swap({
  address,
  experimental = { useAggregator: true, slippage: '10' },
  children,
  title = 'Swap',
  className,
}: SwapReact) {
  const { inputs, toggleButton, swapButton, swapMessage } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      // @ts-ignore
      inputs: childrenArray.filter(({ type }) => type === SwapAmountInput),
      // @ts-ignore
      toggleButton: childrenArray.find(({ type }) => type === SwapToggleButton),
      swapButton: childrenArray.find(
        // @ts-ignore
        ({ type }) => type.name === SwapButton.name,
      ),
      // @ts-ignore
      swapMessage: childrenArray.find(({ type }) => type === SwapMessage),
    };
  }, [children]);

  return (
    <SwapProvider address={address} experimental={experimental}>
      <div
        className={cn(
          background.default,
          'flex w-[500px] flex-col rounded-xl px-6 pt-6 pb-4',
          className,
        )}
        data-testid="ockSwap_Container"
      >
        <div className="mb-4">
          <h3 className={text.title3} data-testid="ockSwap_Title">
            {title}
          </h3>
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
