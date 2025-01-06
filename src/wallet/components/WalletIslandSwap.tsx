import { PressableIcon } from '@/internal/components/PressableIcon';
import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { cn } from '@/styles/theme';
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
  const { showSwap, setShowSwap, isSwapClosing, setIsSwapClosing } =
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

  const backButton = (
    <PressableIcon>
      <button type="button" onClick={handleCloseSwap} aria-label="Back">
        <div className="p-2">{backArrowSvg}</div>
      </button>
    </PressableIcon>
  );

  return (
    <div
      ref={swapDivRef}
      tabIndex={showSwap ? -1 : undefined}
      className={cn(
        isSwapClosing
          ? 'fade-out slide-out-to-left-5 animate-out fill-mode-forwards ease-in-out'
          : 'fade-in slide-in-from-right-5 animate-in duration-150 ease-out',
        'relative',
      )}
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
        headerLeftContent={backButton}
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
