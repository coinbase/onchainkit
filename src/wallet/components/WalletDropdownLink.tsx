import { isValidElement, useMemo } from 'react';
import { walletSvg } from '../../internal/svg/walletSvg';
import { cn, pressable, text } from '../../styles/theme';
import type { WalletDropdownLinkReact } from '../types';

export function WalletDropdownLink({
  children,
  className,
  icon,
  href,
  rel,
  target,
}: WalletDropdownLinkReact) {
  const iconSvg = useMemo(() => {
    if (icon === undefined) {
      return null;
    }
    switch (icon) {
      case 'wallet':
        return walletSvg;
    }
    if (isValidElement(icon)) {
      return icon;
    }
  }, [icon]);

  return (
    <a
      className={cn(
        pressable.default,
        'relative flex items-center px-4 py-3',
        className,
      )}
      href={href}
      target={target}
      rel={rel}
    >
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center">
        {iconSvg}
      </div>
      <span className={cn(text.body, 'pl-6')}>{children}</span>
    </a>
  );
}