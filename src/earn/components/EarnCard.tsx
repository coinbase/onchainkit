import { background, border, cn } from '@/styles/theme';
import { EarnCardReact } from '../types';

export function EarnCard({ children, className }: EarnCardReact) {
  return (
    <div
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
