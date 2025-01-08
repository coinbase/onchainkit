import { border, cn, pressable } from '@/styles/theme';
import type { ReactNode } from 'react';

type PressableIconProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  buttonClassName?: string;
};

export function PressableIcon({
  children,
  className,
  onClick,
  ariaLabel,
  buttonClassName,
}: PressableIconProps) {
  return (
    <div
      className={cn(
        pressable.default,
        border.radiusInner,
        border.default,
        'flex items-center justify-center',
        className,
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className={cn('flex items-center justify-center', buttonClassName)}
        data-testid="ockPressableIconButton"
        aria-label={ariaLabel}
      >
        {children}
      </button>
    </div>
  );
}
