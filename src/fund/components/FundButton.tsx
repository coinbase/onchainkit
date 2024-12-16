import { useCallback, useMemo } from 'react';
import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { addSvg } from '../../internal/svg/addSvg';
import { successSvg } from '../../internal/svg/successSvg';
import { errorSvg } from '../../internal/svg/errorSvg';
import { openPopup } from '../../internal/utils/openPopup';
import { border, cn, color, pressable, text } from '../../styles/theme';
import { useGetFundingUrl } from '../hooks/useGetFundingUrl';
import type { FundButtonReact } from '../types';
import { getFundingPopupSize } from '../utils/getFundingPopupSize';
import { Spinner } from '../../internal/components/Spinner';

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
  const fundingUrlToRender = fundingUrl ?? useGetFundingUrl();
  const isDisabled = disabled || !fundingUrlToRender;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (fundingUrlToRender) {
        onClick?.();
        const { height, width } = getFundingPopupSize(
          popupSize,
          fundingUrlToRender
        );
        const popupWindow = openPopup({
          url: fundingUrlToRender,
          height,
          width,
          target,
        });

        if (!popupWindow) {
          return null;
        }

        const interval = setInterval(() => {
          if (popupWindow?.closed) {
            clearInterval(interval);
            onPopupClose?.();
          }
        }, 500);
      }
    },
    [fundingUrlToRender, popupSize, target, onPopupClose, onClick]
  );

  const classNames = cn(
    componentTheme,
    pressable.primary,
    'px-4 py-3 inline-flex items-center justify-center space-x-2 disabled',
    isDisabled && pressable.disabled,
    text.headline,
    border.radius,
    color.inverse,
    className
  );

  const buttonIcon = useMemo(() => {
    switch(buttonState) {
      case 'loading':
        return '';
      case 'success':
        return successSvg
      case 'error':
        return errorSvg
      default:
        return addSvg;
    }
  }, [buttonState]);

  const buttonTextContent = useMemo(() => {
    switch(buttonState) {
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

  const buttonContent = (
    <>
      {buttonState === 'loading' && <Spinner />}
      {/* h-6 is to match the icon height to the line-height set by text.headline */}
      {hideIcon || <span className="flex h-6 items-center">{buttonIcon}</span>}
      {hideText || <span data-testid="fundButtonTextContent">{buttonTextContent}</span>}
    </>
  );

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

  return (
    <button
      className={classNames}
      onClick={handleClick}
      type="button"
      disabled={isDisabled}
    >
      {buttonContent}
    </button>
  );
}
