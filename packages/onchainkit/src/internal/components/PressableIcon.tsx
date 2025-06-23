import { cn, pressable } from '@/styles/theme';
import type { ReactNode } from 'react';

type PressableIconProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
};

export function PressableIcon({
  children,
  className,
  onClick,
  'aria-label': ariaLabel,
}: PressableIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="ockPressableIconButton"
      aria-label={ariaLabel}
      className={cn(
        pressable.default,
        'rounded-ock-inner',
        'border-ock-background',
        'flex items-center justify-center',
        className,
      )}
    >
      {children}
    </button>
  );
}
