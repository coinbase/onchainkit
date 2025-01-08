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
import { useCallback } from 'react';
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
  const { setShowSwap, isSwapClosing, setIsSwapClosing } =
    useWalletIslandContext();

  const handleCloseSwap = useCallback(() => {
    setIsSwapClosing(true);

    setTimeout(() => {
      setShowSwap(false);
    }, 200);

    setTimeout(() => {
      setIsSwapClosing(false);
    }, 400);
  }, [setShowSwap, setIsSwapClosing]);

  const backButton = (
    <PressableIcon>
      <button type="button" onClick={handleCloseSwap} aria-label="Back button">
        <div className="p-2">{backArrowSvg}</div>
      </button>
    </PressableIcon>
  );

  return (
    <div
      className={cn(
        'h-full w-full',
        isSwapClosing
          ? 'fade-out slide-out-to-right-5 animate-out fill-mode-forwards ease-in-out'
          : 'fade-in slide-in-from-right-5 linear animate-in duration-150',
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
        <SwapAmountInput label="Sell" swappableTokens={from} type="from" />
        <SwapToggleButton />
        <SwapAmountInput label="Buy" swappableTokens={to} type="to" />
        <SwapButton disabled={disabled} />
        <SwapMessage />
        <SwapToast />
      </Swap>
    </div>
  );
}
