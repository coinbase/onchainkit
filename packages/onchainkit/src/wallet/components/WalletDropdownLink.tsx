'use client';

import { useIcon } from '../../internal/hooks/useIcon';
import { cn, color, pressable, text } from '../../styles/theme';
import type { WalletDropdownLinkReact } from '../types';

export function WalletDropdownLink({
  children,
  className,
  icon,
  href,
  rel,
  target,
}: WalletDropdownLinkReact) {
  const iconSvg = useIcon({ icon });

  return (
    <a
      className={cn(
        pressable.default,
        color.foreground,
        'relative flex items-center px-4 py-3',
        className,
      )}
      href={href}
      target={target}
      rel={rel}
    >
      <div className="-translate-y-1/2 absolute top-1/2 left-4 flex h-[1.125rem] w-[1.125rem] items-center justify-center">
        {iconSvg}
      </div>
      <span className={cn(text.body, 'pl-6')}>{children}</span>
    </a>
  );
}
