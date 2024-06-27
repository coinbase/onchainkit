import { type ReactNode, useMemo, isValidElement } from 'react';
import { cn, pressable, text } from '../../styles/theme';
import { walletSvg } from './walletSvg';

type WalletDropdownLinkReact = {
  icon?: 'wallet' & ReactNode;
  href: string;
  children: string;
};

export function WalletDropdownLink({
  icon,
  href,
  children,
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
      className={cn(pressable.default, 'flex items-center gap-2 px-4 py-2')}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {iconSvg && <div className="h-5 w-5">{iconSvg}</div>}
      <span className={cn(text.body, 'shrink-0')}>{children}</span>
    </a>
  );
}
