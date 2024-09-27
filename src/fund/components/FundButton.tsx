import { useCallback } from 'react';
import { addSvg } from '../../internal/svg/addSvg';
import { openPopup } from '../../internal/utils/openPopup';
import { cn, color, pressable, text } from '../../styles/theme';
import { useGetFundingUrl } from '../hooks/useGetFundingUrl';
import type { FundButtonReact } from '../types';
import { getPopupSize } from '../utils/getPopupSize';

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
}: FundButtonReact) {
  // If the fundingUrl prop is undefined, fallback to our recommended funding URL based on the wallet type
  const fundingUrlToRender = fundingUrl ?? useGetFundingUrl();
  const isDisabled = disabled || !fundingUrlToRender;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (fundingUrlToRender) {
        const { height, width } = getPopupSize(popupSize, fundingUrlToRender);
        openPopup({
          url: fundingUrlToRender,
          height,
          width,
          target,
        });
      }
    },
    [fundingUrlToRender, popupSize, target],
  );

  const classNames = cn(
    pressable.primary,
    'rounded-xl px-4 py-3',
    'inline-flex items-center justify-center space-x-2 disabled',
    isDisabled && pressable.disabled,
    text.headline,
    color.inverse,
    className,
  );

  const buttonContent = (
    <>
      {/* h-6 is to match the icon height to the line-height set by text.headline */}
      {hideIcon || <span className="flex h-6 items-center">{addSvg}</span>}
      {hideText || <span>{buttonText}</span>}
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
