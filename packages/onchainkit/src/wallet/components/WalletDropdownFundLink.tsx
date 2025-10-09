'use client';
import { ReactNode, useCallback, useMemo } from 'react';
import { useGetFundingUrl } from '../../fund/hooks/useGetFundingUrl';
import { getFundingPopupSize } from '../../fund/utils/getFundingPopupSize';
import { useIcon } from '../../internal/hooks/useIcon';
import { openPopup } from '../../internal/utils/openPopup';
import {
  cn,
  prefixClassName,
  pressable,
  text as themeText,
} from '../../styles/theme';

export type WalletDropdownFundLinkProps = {
  /** Optional className override for the element */
  className?: string;
  /** Optional icon override */
  icon?: ReactNode;
  /** Whether to open the funding flow in a tab or a popup window */
  openIn?: 'popup' | 'tab';
  /**
   * Note: popupSize is only respected when providing your own funding link, or when a Coinbase Smart Wallet is
   * connected. For any other wallet popupSize will be ignored as the Coinbase Onramp widget requires a fixed size
   * popup window.
   */
  popupSize?: 'sm' | 'md' | 'lg';
  /** Specifies the relationship between the current document and the linked document */
  rel?: string;
  /** Where to open the target if `openIn` is set to tab */
  target?: string;
  /** Optional text override */
  text?: string;
  /** Optional funding URL override */
  fundingUrl?: string;
  /** CDP on/offramp session token. @see {@link https://docs.cdp.coinbase.com/onramp-&-offramp/session-token-authentication} */
  sessionToken?: string;
};

export function WalletDropdownFundLink({
  className,
  fundingUrl,
  icon = 'fundWallet',
  openIn = 'popup',
  popupSize = 'md',
  rel,
  target,
  text = 'Fund wallet',
  sessionToken,
}: WalletDropdownFundLinkProps) {
  const derivedFundingUrl = useGetFundingUrl({
    originComponentName: 'WalletDropdownFundLink',
    sessionToken,
  });
  const fundingUrlToRender = fundingUrl ?? derivedFundingUrl;

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

  const overrideClassName = prefixClassName(
    cn(
      pressable.default,
      'text-ock-foreground',
      // Disable hover effects if there is no funding URL
      !fundingUrlToRender && 'pointer-events-none',
      'relative flex items-center px-4 py-3 w-full',
    ),
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
        className={cn(overrideClassName, className)}
        href={fundingUrlToRender}
        target={target}
        rel={rel}
      >
        {linkContent}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={cn(overrideClassName, className)}
      onClick={handleClick}
    >
      {linkContent}
    </button>
  );
}
