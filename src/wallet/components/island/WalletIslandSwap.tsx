import { useCallback, useEffect, useRef } from 'react';
import { backArrowSvg } from '../../../internal/svg/backArrowSvg';
import { border, cn, pressable } from '../../../styles/theme';
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

export function WalletIslandSwap({
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
  const { showSwap, setShowSwap } = useWalletIslandContext();
  const swapDivRef = useRef<HTMLDivElement>(null);

  const handleCloseSwap = useCallback(() => {
    setShowSwap(false);
  }, [setShowSwap]);

  const backButton = (
    <button
      type="button"
      onClick={handleCloseSwap}
      className={cn(
        pressable.default,
        border.radius,
        border.default,
        'flex items-center justify-center p-3',
      )}
      aria-label="Back button"
    >
      {backArrowSvg}
    </button>
  );

  useEffect(() => {
    if (showSwap) {
      swapDivRef.current?.focus();
    }
  }, [showSwap]);

  return (
    <div
      ref={swapDivRef}
      tabIndex={showSwap ? -1 : undefined}
      className="animate-walletIslandContainerIn"
      data-testid="ockWalletIslandSwap"
    >
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
