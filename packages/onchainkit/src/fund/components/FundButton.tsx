'use client';

import { useCallback, useMemo } from 'react';
import { useTheme } from '../../internal/hooks/useTheme';
import { cn, pressable, text } from '../../styles/theme';
import { useAccount } from 'wagmi';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { FundEvent } from '../../core/analytics/types';
import { usePopupMonitor } from '@/buy/hooks/usePopupMonitor';
import { ErrorSvg } from '@/internal/svg/errorSvg';
import { openPopup } from '@/internal/utils/openPopup';
import { Spinner } from '../../internal/components/Spinner';
import { AddSvg } from '../../internal/svg/addSvg';
import { SuccessSvg } from '../../internal/svg/successSvg';
import { ConnectWallet } from '../../wallet/components/ConnectWallet';
import { useGetFundingUrl } from '../hooks/useGetFundingUrl';
import type { FundButtonProps } from '../types';
import { getFundingPopupSize } from '../utils/getFundingPopupSize';

export function FundButton({
  className,
  children,
  disabled = false,
  fundingUrl,
  openIn = 'popup',
  popupSize = 'md',
  target,
  state: buttonState = 'default',
  fiatCurrency = 'USD',
  onPopupClose,
  onClick,
  render,
}: FundButtonProps) {
  const componentTheme = useTheme();
  // If the fundingUrl prop is undefined, fallback to our recommended funding URL based on the wallet type
  const fallbackFundingUrl = useGetFundingUrl({
    fiatCurrency,
    originComponentName: 'FundButton',
  });
  const { address } = useAccount();
  const fundingUrlToRender = fundingUrl ?? fallbackFundingUrl;
  const isDisabled = disabled || !fundingUrlToRender;
  const shouldShowConnectWallet = !address;

  const { startPopupMonitor } = usePopupMonitor(onPopupClose);
  const { sendAnalytics } = useAnalytics();

  const handleAnalyticsInitiated = useCallback(() => {
    sendAnalytics(FundEvent.FundInitiated, {
      currency: fiatCurrency,
    });
  }, [sendAnalytics, fiatCurrency]);

  const handleAnalyticsFailure = useCallback(
    (error: string) => {
      sendAnalytics(FundEvent.FundFailure, {
        error,
        metadata: { currency: fiatCurrency },
      });
    },
    [sendAnalytics, fiatCurrency],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (fundingUrlToRender && openIn === 'tab') {
        handleAnalyticsInitiated();
        onClick?.();
        window.open(fundingUrlToRender, '_blank');
        return;
      }

      if (fundingUrlToRender) {
        handleAnalyticsInitiated();
        onClick?.();
        const { height, width } = getFundingPopupSize(
          popupSize,
          fundingUrlToRender,
        );
        const popupWindow = openPopup({
          url: fundingUrlToRender,
          height,
          width,
          target,
        });

        if (popupWindow) {
          startPopupMonitor(popupWindow);
        } else {
          handleAnalyticsFailure('Failed to open funding popup');
        }
      }
    },
    [
      fundingUrlToRender,
      openIn,
      handleAnalyticsInitiated,
      onClick,
      popupSize,
      target,
      startPopupMonitor,
      handleAnalyticsFailure,
    ],
  );

  const buttonColorClass = useMemo(() => {
    if (buttonState === 'error') {
      return 'bg-ock-bg-error';
    }
    return pressable.primary;
  }, [buttonState]);

  const classNames = cn(
    componentTheme,
    buttonColorClass,
    'rounded-ock-defaultpx-4 py-3 inline-flex items-center justify-center space-x-2',
    {
      [pressable.disabled]: isDisabled,
    },
    text.headline,
    'text-ock-text-inverse',
    className,
  );

  const buttonIcon = useMemo(() => {
    switch (buttonState) {
      case 'loading':
        return '';
      case 'success':
        return <SuccessSvg className="fill-[#F9FAFB]" />;
      case 'error':
        return <ErrorSvg className="fill-[#F9FAFB]" />;
      default:
        return <AddSvg />;
    }
  }, [buttonState]);

  const buttonTextContent = useMemo(() => {
    switch (buttonState) {
      case 'loading':
        return '';
      case 'success':
        return 'Success';
      case 'error':
        return 'Something went wrong';
      default:
        return 'Fund';
    }
  }, [buttonState]);

  const buttonContent = useMemo(() => {
    if (buttonState === 'loading') {
      return <Spinner />;
    }

    return (
      <>
        {buttonIcon && (
          <span
            data-testid="ockFundButtonIcon"
            className="flex h-6 items-center"
          >
            {buttonIcon}
          </span>
        )}
        <span data-testid="ockFundButtonTextContent">{buttonTextContent}</span>
      </>
    );
  }, [buttonState, buttonIcon, buttonTextContent]);

  if (shouldShowConnectWallet) {
    return <ConnectWallet className={cn('w-full', className)} />;
  }

  if (render) {
    return render({
      status: buttonState,
      onClick: handleClick,
      isDisabled,
    });
  }

  return (
    <button
      className={classNames}
      onClick={handleClick}
      type="button"
      disabled={isDisabled}
      data-testid="ockFundButton"
    >
      {children ?? buttonContent}
    </button>
  );
}
