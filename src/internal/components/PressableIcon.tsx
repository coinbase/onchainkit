import { border, cn, pressable } from '@/styles/theme';
import type { ReactNode } from 'react';

export function PressableIcon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        pressable.default,
        border.radius,
        border.default,
        'flex items-center justify-center',
        className,
      )}
    >
      {children}
    </div>
  );
}
