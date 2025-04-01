import { border, cn, pressable } from '@/styles/theme';
import type { ReactNode } from 'react';

type PressableIconProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export function PressableIcon({
  children,
  className,
  onClick,
  ariaLabel,
}: PressableIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="ockPressableIconButton"
      aria-label={ariaLabel}
      className={cn(
        pressable.default,
        border.radiusInner,
        border.default,
        'flex items-center justify-center',
        className,
      )}
    >
      {children}
    </button>
  );
}
