import { isValidElement, useMemo } from 'react';
import { FundWalletSvg } from '../../internal/svg/fundWallet';
import { cn, pressable, text as themeText } from '../../styles/theme';
import { version } from '../../version';
import type { WalletDropdownFundLinkReact, WindowSizes } from '../types';

export function WalletDropdownFundLink({
  className,
  icon,
  rel,
  openIn = 'tab',
  target,
  text = 'Fund wallet',
  windowSize = 'm',
}: WalletDropdownFundLinkReact) {
  const iconSvg = useMemo(() => {
    if (icon === undefined) {
      return FundWalletSvg;
    }
    if (isValidElement(icon)) {
      return icon;
    }
  }, [icon]);

  const currentURL = window.location.href;
  const tabName = document.title;
  const fundingUrl = `http://keys.coinbase.com/funding?dappName=${tabName}&dappUrl=${currentURL}&onchainkit=${version}`;
  const windowSizes: WindowSizes = {
    s: { width: '23vw', height: '28.75vw' },
    m: { width: '29vw', height: '36.25vw' },
    l: { width: '35vw', height: '43.75vw' },
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const { width, height } = windowSizes[windowSize];

    // Define minimum sizes (in pixels)
    const minWidth = 280;
    const minHeight = 350;

    // Convert viewport units to pixels
    const vwToPx = (vw: number) => (vw / 100) * window.innerWidth;

    const widthPx = Math.max(
      minWidth,
      Math.round(vwToPx(Number.parseFloat(width))),
    );
    const heightPx = Math.max(
      minHeight,
      Math.round(vwToPx(Number.parseFloat(height))),
    );

    // Ensure the width and height don't exceed 90% of the viewport dimensions
    const maxWidth = Math.round(window.innerWidth * 0.9);
    const maxHeight = Math.round(window.innerHeight * 0.9);
    const adjustedWidthPx = Math.min(widthPx, maxWidth);
    const adjustedHeightPx = Math.min(heightPx, maxHeight);

    const left = Math.round((window.screen.width - adjustedWidthPx) / 2);
    const top = Math.round((window.screen.height - adjustedHeightPx) / 2);

    const windowFeatures = `width=${adjustedWidthPx},height=${adjustedHeightPx},resizable,scrollbars=yes,status=1,left=${left},top=${top}`;
    window.open(fundingUrl, 'Coinbase Fund Wallet', windowFeatures);
  };

  const commonClassName = cn(
    pressable.default,
    'relative flex items-center px-4 py-3',
    className,
  );

  const linkContent = (
    <>
      <div className="-translate-y-1/2 absolute top-1/2 left-4 flex h-4 w-4 items-center justify-center">
        {iconSvg}
      </div>
      <span className={cn(themeText.body, 'pl-6')}>{text}</span>
    </>
  );

  if (openIn === 'tab') {
    return (
      <a
        className={commonClassName}
        href={fundingUrl}
        target={target}
        rel={rel}
      >
        {linkContent}
      </a>
    );
  }
  return (
    <button type="button" className={commonClassName} onClick={handleClick}>
      {linkContent}
    </button>
  );
}
