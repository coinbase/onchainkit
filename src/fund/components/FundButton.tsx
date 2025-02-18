'use client';

import { useCallback } from 'react';
import { useTheme } from '../../internal/hooks/useTheme';
import { border, cn, color, pressable, text } from '../../styles/theme';

import { usePopupMonitor } from '@/buy/hooks/usePopupMonitor';
import { ErrorSvg } from '@/internal/svg/errorSvg';
import { openPopup } from '@/internal/utils/openPopup';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { FundEvent } from '../../core/analytics/types';
import { Spinner } from '../../internal/components/Spinner';
import { AddSvg } from '../../internal/svg/addSvg';
import { SuccessSvg } from '../../internal/svg/successSvg';
import { background } from '../../styles/theme';
import { ConnectWallet } from '../../wallet/components/ConnectWallet';
import { useGetFundingUrl } from '../hooks/useGetFundingUrl';
import type { FundButtonReact } from '../types';
import { getFundingPopupSize } from '../utils/getFundingPopupSize';

export function FundButton({
  className,
  disabled = false,
  fundingUrl,
  hideIcon = false,
  hideText = false,
  openIn = 'popup',
  popupSize = 'md',
  rel,
  target,
  text: buttonText = 'Fund',
  successText: buttonSuccessText = 'Success',
  errorText: buttonErrorText = 'Something went wrong',
  state: buttonState = 'default',
  fiatCurrency = 'USD',
  onPopupClose,
  onClick,
}: FundButtonReact) {
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
      popupSize,
      target,
      onClick,
      startPopupMonitor,
      handleAnalyticsInitiated,
      handleAnalyticsFailure,
    ],
  );

  const buttonColorClass = useMemo(() => {
    if (buttonState === 'error') {
      return background.error;
    }
    return pressable.primary;
  }, [buttonState]);

  const classNames = cn(
    componentTheme,
    buttonColorClass,
    'px-4 py-3 inline-flex items-center justify-center space-x-2',
    {
      [pressable.disabled]: isDisabled,
    },
    text.headline,
    border.radius,
    color.inverse,
    className,
  );

  const buttonIcon = useMemo(() => {
    if (hideIcon) {
      return null;
    }
    switch (buttonState) {
      case 'loading':
        return '';
      case 'success':
        return <SuccessSvg fill="#F9FAFB" />;
      case 'error':
        return <ErrorSvg fill="#F9FAFB" />;
      default:
        return <AddSvg />;
    }
  }, [buttonState, hideIcon]);

  const buttonTextContent = useMemo(() => {
    switch (buttonState) {
      case 'loading':
        return '';
      case 'success':
        return buttonSuccessText;
      case 'error':
        return buttonErrorText;
      default:
        return buttonText;
    }
  }, [buttonState, buttonSuccessText, buttonErrorText, buttonText]);

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
        {hideText || (
          <span data-testid="ockFundButtonTextContent">
            {buttonTextContent}
          </span>
        )}
      </>
    );
  }, [buttonState, buttonIcon, buttonTextContent, hideText]);

  if (openIn === 'tab') {
    return (
      <a
        className={classNames}
        href={fundingUrlToRender}
        // If openIn is 'tab', default target to _blank so we don't accidentally navigate in the current tab
        target={target ?? '_blank'}
        rel={rel}
      >
        {buttonContent}
      </a>
    );
  }

  if (shouldShowConnectWallet) {
    return <ConnectWallet className={cn('w-full', className)} />;
  }

  return (
    <button
      className={classNames}
      onClick={handleClick}
      type="button"
      disabled={isDisabled}
      data-testid="ockFundButton"
    >
      {buttonContent}
    </button>
  );
}
