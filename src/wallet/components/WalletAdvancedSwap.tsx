'use client';

import { PressableIcon } from '@/internal/components/PressableIcon';
import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { cn } from '@/styles/theme';
import { Swap } from '@/swap/components/Swap';
import { SwapAmountInput } from '@/swap/components/SwapAmountInput';
import { SwapButton } from '@/swap/components/SwapButton';
import { SwapMessage } from '@/swap/components/SwapMessage';
import { SwapSettings } from '@/swap/components/SwapSettings';
import { SwapSettingsSlippageDescription } from '@/swap/components/SwapSettingsSlippageDescription';
import { SwapSettingsSlippageInput } from '@/swap/components/SwapSettingsSlippageInput';
import { SwapSettingsSlippageTitle } from '@/swap/components/SwapSettingsSlippageTitle';
import { SwapToast } from '@/swap/components/SwapToast';
import { SwapToggleButton } from '@/swap/components/SwapToggleButton';
import type { SwapDefaultReact } from '@/swap/types';
import { useCallback } from 'react';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';

export function WalletAdvancedSwap({
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
    useWalletAdvancedContext();

  const handleCloseSwap = useCallback(() => {
    setIsSwapClosing(true);
  }, [setIsSwapClosing]);

  const handleAnimationEnd = useCallback(() => {
    if (isSwapClosing) {
      setShowSwap(false);
      setIsSwapClosing(false);
    }
  }, [isSwapClosing, setShowSwap, setIsSwapClosing]);

  const backButton = (
    <PressableIcon ariaLabel="Back button" onClick={handleCloseSwap}>
      <div className="p-2">{backArrowSvg}</div>
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
      onAnimationEnd={handleAnimationEnd}
      data-testid="ockWalletAdvancedSwap"
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
