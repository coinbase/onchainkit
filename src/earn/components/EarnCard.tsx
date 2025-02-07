import { background, border, cn } from '@/styles/theme';
import type { EarnCardReact } from '../types';

export function EarnCard({ children, className }: EarnCardReact) {
  return (
    <div
      data-testid="ockEarnCard"
      className={cn(
        border.default,
        'flex flex-col gap-8 border-t p-4',
        background.default,
        className,
      )}
    >
      {children}
    </div>
  );
}
