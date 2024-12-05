import { useEffect, useRef } from 'react';
import {
  Swap,
  SwapAmountInput,
  SwapButton,
  SwapMessage,
  SwapSettings,
  SwapSettingsSlippageDescription,
  SwapSettingsSlippageInput,
  SwapSettingsSlippageTitle,
  SwapToast,
  SwapToggleButton,
} from '../../../swap';
import type { SwapDefaultReact } from '../../../swap/types';
import { useWalletIslandContext } from './WalletIslandProvider';

export default function WalletIslandSwap({
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
  backButton,
}: SwapDefaultReact) {
  const { showSwap } = useWalletIslandContext();
  const swapDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showSwap) {
      swapDivRef.current?.focus();
    }
  }, [showSwap]);

  return (
    <div ref={swapDivRef} tabIndex={showSwap ? -1 : undefined}>
      <Swap
        className={className}
        onStatus={onStatus}
        onSuccess={onSuccess}
        onError={onError}
        config={config}
        isSponsored={isSponsored}
        title={title}
        experimental={experimental}
        backButton={backButton}
      >
        <SwapSettings className="w-auto">
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
    </div>
  );
}
