import { Children, useMemo } from 'react';
import { findComponent } from '../../internal/utils/findComponent';
import type { Token } from '../../token';
import { SwapAmountInput } from '../components/SwapAmountInput';
import { SwapButton } from '../components/SwapButton';
import { SwapMessage } from '../components/SwapMessage';
import { SwapSettings } from '../components/SwapSettings';
import { SwapSettingsSlippageDescription } from '../components/SwapSettingsSlippageDescription';
import { SwapSettingsSlippageInput } from '../components/SwapSettingsSlippageInput';
import { SwapSettingsSlippageTitle } from '../components/SwapSettingsSlippageTitle';
import { SwapToggleButton } from '../components/SwapToggleButton';

export const useSwapComponents = ({
  children,
  swappableTokens,
  fromToken,
  toToken,
}: {
  children: React.ReactNode;
  swappableTokens?: Token[];
  fromToken?: Token;
  toToken?: Token;
}) => {
  return useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      inputs:
        childrenArray.filter(findComponent(SwapAmountInput)).length === 0
          ? [
              <SwapAmountInput
                label="Sell"
                swappableTokens={swappableTokens}
                token={fromToken}
                type="from"
              />,
              <SwapAmountInput
                label="Buy"
                swappableTokens={swappableTokens}
                token={toToken}
                type="to"
              />,
            ]
          : childrenArray.filter(findComponent(SwapAmountInput)),
      toggleButton: childrenArray.find(findComponent(SwapToggleButton)) || (
        <SwapToggleButton />
      ),
      swapButton: childrenArray.find(findComponent(SwapButton)) || (
        <SwapButton />
      ),
      swapMessage: childrenArray.find(findComponent(SwapMessage)) || (
        <SwapMessage />
      ),
      swapSettings: childrenArray.find(findComponent(SwapSettings)) || (
        <SwapSettings>
          <SwapSettingsSlippageTitle>Max. slippage</SwapSettingsSlippageTitle>
          <SwapSettingsSlippageDescription>
            Your swap will revert if the prices change by more than the selected
            percentage.
          </SwapSettingsSlippageDescription>
          <SwapSettingsSlippageInput />
        </SwapSettings>
      ),
    };
  }, [children, swappableTokens, fromToken, toToken]);
};
