import { isValidElement, useMemo } from 'react';
import { FundWalletSvg } from '../../internal/svg/fundWallet';
import { cn, pressable, text } from '../../styles/theme';
import type { WalletDropdownLinkReact } from '../types';

export function WalletDropdownFundLink({
  children,
  className,
  icon,
  rel,
  target,
}: WalletDropdownLinkReact) {
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

  return (
    <a
      className={cn(
        pressable.default,
        'relative flex items-center px-4 py-3',
        className
      )}
      href={`http://keys.coinbase.com/funding?dappName=${tabName}&dappUrl=${currentURL}`}
      target={target}
      rel={rel}
    >
      <div className="-translate-y-1/2 absolute top-1/2 left-4 flex h-4 w-4 items-center justify-center">
        {iconSvg}
      </div>
      <span className={cn(text.body, 'pl-6')}>
        {children || 'Deposit Funds'}
      </span>
    </a>
  );
}
