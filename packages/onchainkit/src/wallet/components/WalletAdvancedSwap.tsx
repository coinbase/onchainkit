'use client';

import { PressableIcon } from '@/internal/components/PressableIcon';
import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { cn, text } from '@/styles/theme';
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
import { useCallback } from 'react';
import type { WalletAdvancedSwapProps } from '../types';
import { useWalletContext } from './WalletProvider';
import { useTheme } from '@/internal/hooks/useTheme';

export function WalletAdvancedSwap({
  config,
  classNames,
  disabled,
  experimental,
  from,
  isSponsored = false,
  onError,
  onStatus,
  onSuccess,
  title,
  to,
}: WalletAdvancedSwapProps) {
  const {
    setActiveFeature,
    isActiveFeatureClosing,
    setIsActiveFeatureClosing,
  } = useWalletContext();

  const handleCloseSwap = useCallback(() => {
    setIsActiveFeatureClosing(true);
  }, [setIsActiveFeatureClosing]);

  const handleAnimationEnd = useCallback(() => {
    if (isActiveFeatureClosing) {
      setActiveFeature(null);
      setIsActiveFeatureClosing(false);
    }
  }, [isActiveFeatureClosing, setActiveFeature, setIsActiveFeatureClosing]);

  const backButton = (
    <PressableIcon aria-label="Back button" onClick={handleCloseSwap}>
      <div className="p-2">{backArrowSvg}</div>
    </PressableIcon>
  );

  const componentTheme = useTheme();

  return (
    <div
      className={cn(
        'h-full',
        'rounded-default',
        isActiveFeatureClosing
          ? 'fade-out slide-out-to-right-5 animate-out fill-mode-forwards ease-in-out'
          : 'fade-in slide-in-from-right-5 linear animate-in duration-150',
        'relative w-88 h-120',
        classNames?.container,
      )}
      onAnimationEnd={handleAnimationEnd}
      data-testid="ockWalletAdvancedSwap"
    >
      <Swap
        className={cn('w-full px-4 pt-3 pb-4', classNames?.container)}
        onStatus={onStatus}
        onSuccess={onSuccess}
        onError={onError}
        config={config}
        isSponsored={isSponsored}
        experimental={experimental}
      >
        <div
          className={cn(
            componentTheme,
            'bg-background rounded-default text-foreground relative flex w-full max-w-[500px] flex-col px-6 pt-6 pb-4',
          )}
          data-testid="ockSwap_Container"
        >
          <div className="absolute flex w-1/2 items-center justify-between">
            {backButton}
            <h3
              className={cn(text.title3, 'text-center')}
              data-testid="ockSwap_Title"
            >
              {title}
            </h3>
          </div>

          <SwapSettings
            className={cn('w-auto', classNames?.settings?.container)}
          >
            <SwapSettingsSlippageTitle
              className={classNames?.settings?.slippageTitle}
            >
              Max. slippage
            </SwapSettingsSlippageTitle>
            <SwapSettingsSlippageDescription
              className={classNames?.settings?.slippageDescription}
            >
              Your swap will revert if the prices change by more than the
              selected percentage.
            </SwapSettingsSlippageDescription>
            <SwapSettingsSlippageInput
              className={classNames?.settings?.slippageInput}
            />
          </SwapSettings>
          <SwapAmountInput
            label="Sell"
            swappableTokens={from}
            type="from"
            className={classNames?.fromAmountInput}
          />
          <SwapToggleButton className={classNames?.toggleButton} />
          <SwapAmountInput
            label="Buy"
            swappableTokens={to}
            type="to"
            className={classNames?.toAmountInput}
          />
          <SwapButton disabled={disabled} className={classNames?.swapButton} />
          <SwapMessage className={classNames?.message} />
          <SwapToast className={classNames?.toast} />
        </div>
      </Swap>
    </div>
  );
}
