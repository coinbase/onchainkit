'use client';

import { useCallback, useMemo } from 'react';
import { useGetFundingUrl } from '../../fund/hooks/useGetFundingUrl';
import { getFundingPopupSize } from '../../fund/utils/getFundingPopupSize';
import { useIcon } from '../../internal/hooks/useIcon';
import { openPopup } from '../../internal/utils/openPopup';
import { cn, color, pressable, text as themeText } from '../../styles/theme';
import type { WalletDropdownFundLinkReact } from '../types';

export function WalletDropdownFundLink({
  className,
  fundingUrl,
  icon = 'fundWallet',
  openIn = 'popup',
  popupSize = 'md',
  rel,
  target,
  text = 'Fund wallet',
}: WalletDropdownFundLinkReact) {
  // If we can't get a funding URL, this component will be a no-op and render a disabled link
  const fundingUrlToRender =
    fundingUrl ??
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useGetFundingUrl({
      originComponentName: 'WalletDropdownFundLink',
    });
  const iconSvg = useIcon({ icon });

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (fundingUrlToRender) {
        const { height, width } = getFundingPopupSize(
          popupSize,
          fundingUrlToRender,
        );
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

  const overrideClassName = cn(
    pressable.default,
    color.foreground,
    // Disable hover effects if there is no funding URL
    !fundingUrlToRender && 'pointer-events-none',
    'relative flex items-center px-4 py-3 w-full',
    className,
  );

  const linkContent = useMemo(
    () => (
      // We put disabled on the content wrapper rather than the button/link because we dont wan't to change the
      // background color of the dropdown item, just the text and icon
      <span className={cn(!fundingUrlToRender && pressable.disabled)}>
        <div className="-translate-y-1/2 absolute top-1/2 left-4 flex h-[1.125rem] w-[1.125rem] items-center justify-center">
          {iconSvg}
        </div>
        <span className={cn(themeText.body, 'pl-6')}>{text}</span>
      </span>
    ),
    [fundingUrlToRender, iconSvg, text],
  );

  if (openIn === 'tab') {
    return (
      <a
        className={overrideClassName}
        href={fundingUrlToRender}
        target={target}
        rel={rel}
      >
        {linkContent}
      </a>
    );
  }

  return (
    <button type="button" className={overrideClassName} onClick={handleClick}>
      {linkContent}
    </button>
  );
}
