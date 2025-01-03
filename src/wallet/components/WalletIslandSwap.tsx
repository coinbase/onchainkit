import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { border, cn, pressable } from '@/styles/theme';
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
} from '@/swap';
import type { SwapDefaultReact } from '@/swap/types';
import { useCallback, useEffect, useRef } from 'react';
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
  title,
  to,
}: SwapDefaultReact) {
  const { showSwap, setShowSwap, setIsSwapClosing, animationClasses } =
    useWalletIslandContext();
  const swapDivRef = useRef<HTMLDivElement>(null);

  const handleCloseSwap = useCallback(() => {
    setIsSwapClosing(true);

    setTimeout(() => {
      setShowSwap(false);
    }, 200);

    setTimeout(() => {
      setIsSwapClosing(false);
    }, 400);
  }, [setShowSwap, setIsSwapClosing]);

  useEffect(() => {
    if (showSwap) {
      swapDivRef.current?.focus();
    }
  }, [showSwap]);

  return (
    <div
      ref={swapDivRef}
      tabIndex={showSwap ? -1 : undefined}
      className={cn(animationClasses.swap, 'relative')}
      data-testid="ockWalletIslandSwap"
    >
      <button
        type="button"
        onClick={handleCloseSwap}
        className={cn(
          pressable.default,
          border.radius,
          border.default,
          'flex items-center justify-center p-3',
          'absolute top-[2px] left-0',
        )}
        aria-label="Back button"
      >
        <div className="scale-125">{backArrowSvg}</div>
      </button>
      <Swap
        className={className}
        onStatus={onStatus}
        onSuccess={onSuccess}
        onError={onError}
        config={config}
        isSponsored={isSponsored}
        title={title}
        experimental={experimental}
        // backButton={backButton}
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
