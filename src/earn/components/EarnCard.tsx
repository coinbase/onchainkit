import { background, border, cn } from '@/styles/theme';
import type { EarnCardReact } from '../types';

export function EarnCard({ children, className }: EarnCardReact) {
  return (
    <div
      data-testid="ockEarnCard"
      className={cn(
        border.default,
        'border-t flex flex-col p-4 gap-4',
        background.default,
        className,
      )}
    >
      {children}
    </div>
  );
}
