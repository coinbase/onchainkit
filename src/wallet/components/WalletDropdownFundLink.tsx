import { isValidElement, useMemo } from 'react';
import { FundWalletSvg } from '../../internal/svg/fundWallet';
import { cn, pressable, text as themeText } from '../../styles/theme';
import { version } from '../../version';
import type { WalletDropdownFundLinkReact } from '../types';

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
  const windowSizes: Record<
    's' | 'm' | 'l',
    {
      width: number;
      height: number;
    }
  > = {
    s: { width: 400, height: 500 },
    m: { width: 600, height: 700 },
    l: { width: 800, height: 900 },
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `http://keys.coinbase.com/funding?dappName=${tabName}&dappUrl=${currentURL}&onchainkit=${version}`;
    const { width, height } = windowSizes[windowSize];
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const windowFeatures = `width=${width},height=${height},resizable,scrollbars=yes,status=1,left=${left},top=${top}`;
    window.open(url, 'Coinbase Fund Wallet', windowFeatures);
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
        href={`http://keys.coinbase.com/funding?dappName=${tabName}&dappUrl=${currentURL}`}
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
