import { border, cn, pressable } from '@/styles/theme';
import type { ReactNode } from 'react';

type PressableIconProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export function PressableIcon({
  children,
  className,
  onClick,
  ariaLabel,
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
        aria-label={ariaLabel}
        className="flex items-center justify-center"
      >
        {children}
      </button>
    </div>
  );
}
