import { usePopupMonitor } from '@/buy/hooks/usePopupMonitor';
import { ErrorSvg } from '@/internal/svg/errorSvg';
import { openPopup } from '@/ui-react/internal/utils/openPopup';
import { useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { Spinner } from '../../internal/components/Spinner';
import { AddSvg } from '../../internal/svg/addSvg';
import { SuccessSvg } from '../../internal/svg/successSvg';
import {
  background,
  border,
  cn,
  color,
  pressable,
  text,
} from '../../styles/theme';
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
  onPopupClose,
  onClick,
}: FundButtonReact) {
  const componentTheme = useTheme();
  // If the fundingUrl prop is undefined, fallback to our recommended funding URL based on the wallet type
  const fallbackFundingUrl = useGetFundingUrl();
  const { address } = useAccount();
  const fundingUrlToRender = fundingUrl ?? fallbackFundingUrl;
  const isDisabled = disabled || !fundingUrlToRender;
  const shouldShowConnectWallet = !address;

  const { startPopupMonitor } = usePopupMonitor(onPopupClose);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (fundingUrlToRender) {
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
        }
      }
    },
    [fundingUrlToRender, popupSize, target, onClick, startPopupMonitor],
  );

  const buttonColorClass = useMemo(() => {
    switch (buttonState) {
      case 'error':
        return background.error;
      case 'loading':
      case 'success':
        return pressable.primary;
      default:
        return pressable.primary;
    }
  }, [buttonState]);

  const classNames = cn(
    componentTheme,
    buttonColorClass,
    'px-4 py-3 inline-flex items-center justify-center space-x-2',
    isDisabled && pressable.disabled,
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
