'use client';
import type { SwapDefaultReact } from '../types';
import { Swap } from './Swap';
import { SwapAmountInput } from './SwapAmountInput';
import { SwapButton } from './SwapButton';
import { SwapMessage } from './SwapMessage';
import { SwapSettings } from './SwapSettings';
import { SwapSettingsSlippageDescription } from './SwapSettingsSlippageDescription';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput';
import { SwapSettingsSlippageTitle } from './SwapSettingsSlippageTitle';
import { SwapToast } from './SwapToast';
import { SwapToggleButton } from './SwapToggleButton';

export function SwapDefault({
  config,
  className,
  disabled,
  experimental,
  from,
  isSponsored = false,
  onError,
  onStatus,
  onSuccess,
  title = 'Swap',
  to,
}: SwapDefaultReact) {
  return (
    <Swap
      className={className}
      onStatus={onStatus}
      onSuccess={onSuccess}
      onError={onError}
      config={config}
      isSponsored={isSponsored}
      title={title}
      experimental={experimental}
    >
      <SwapSettings>
        <SwapSettingsSlippageTitle>Max. slippage</SwapSettingsSlippageTitle>
        <SwapSettingsSlippageDescription>
          Your swap will revert if the prices change by more than the selected
          percentage.
        </SwapSettingsSlippageDescription>
        <SwapSettingsSlippageInput />
      </SwapSettings>
      <SwapAmountInput
        label="Sell"
        swappableTokens={from}
        token={from?.[0]}
        type="from"
      />
      <SwapToggleButton />
      <SwapAmountInput
        label="Buy"
        swappableTokens={to}
        token={to?.[0]}
        type="to"
      />
      <SwapButton disabled={disabled} />
      <SwapMessage />
      <SwapToast />
    </Swap>
  );
}
