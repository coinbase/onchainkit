import { isValidElement, useMemo } from 'react';
import { cn, pressable, text } from '../../styles/theme';
import type { WalletDropdownLinkReact } from '../types';
import { walletSvg } from './walletSvg';

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
        'flex items-center gap-2 px-4 py-2',
        className,
      )}
      href={href}
      target={target}
      rel={rel}
    >
      {iconSvg && <div className="h-5 w-5">{iconSvg}</div>}
      <span className={cn(text.body, 'shrink-0')}>{children}</span>
    </a>
  );
}
