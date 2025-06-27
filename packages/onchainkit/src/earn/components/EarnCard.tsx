import { cn } from '@/styles/theme';
import type { EarnCardProps } from '../types';

export function EarnCard({ children, className }: EarnCardProps) {
  return (
    <div
      data-testid="ockEarnCard"
      className={cn(
        'border-ock-background',
        'flex flex-col gap-8 border-t p-4',
        'bg-ock-background',
        className,
      )}
    >
      {children}
    </div>
  );
}
