import { isValidElement, useMemo } from 'react';
import { FundWalletSvg } from '../../internal/svg/fundWallet';
import { cn, pressable, text as themeText } from '../../styles/theme';
import { version } from '../../version';
import type { WalletDropdownFundLinkReact } from '../types';
import { getWindowDimensions } from '../utils/getWindowDimensions';

export function WalletDropdownFundLink({
  className,
  icon,
  rel,
  popupFeatures,
  openIn = 'tab',
  target,
  text = 'Fund wallet',
  popupSize = 'md',
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
  const fundingUrl = `http://keys.coinbase.com/fund?dappName=${tabName}&dappUrl=${currentURL}&version=${version}&source=onchainkit`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const { width, height } = getWindowDimensions(popupSize);

    const left = Math.round((window.screen.width - width) / 2);
    const top = Math.round((window.screen.height - height) / 2);

    const windowFeatures =
      popupFeatures ||
      `width=${width},height=${height},resizable,scrollbars=yes,status=1,left=${left},top=${top}`;
    window.open(fundingUrl, 'Coinbase Fund Wallet', windowFeatures);
  };

  const overrideClassName = cn(
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
        className={overrideClassName}
        href={fundingUrl}
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
