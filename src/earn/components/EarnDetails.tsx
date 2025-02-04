import { border, cn } from '@/styles/theme';
import { TokenChip } from '@/token';
import type { EarnDetailsReact } from '../types';

export function EarnDetails({ className, token, tag }: EarnDetailsReact) {
  if (!token) {
    return null;
  }
  return (
    <div
      data-testid="ockEarnDetails"
      className={cn(
        border.radius,
        'flex w-full items-center justify-between gap-4',
        className,
      )}
    >
      <TokenChip
        className={'!bg-transparent'}
        token={token}
        isPressable={false}
      />
      {tag}
    </div>
  );
}
