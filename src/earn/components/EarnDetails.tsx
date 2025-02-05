import { Skeleton } from '@/internal/components/Skeleton';
import { border, cn } from '@/styles/theme';
import { TokenChip } from '@/token';
import type { EarnDetailsReact } from '../types';
export function EarnDetails({ className, token, tag }: EarnDetailsReact) {
  return (
    <div
      data-testid="ockEarnDetails"
      className={cn(
        border.radius,
        'flex w-full items-center justify-between gap-4',
        className,
      )}
    >
      {token ? (
        <TokenChip
          className="!bg-transparent"
          token={token}
          isPressable={false}
        />
      ) : (
        <Skeleton className="!rounded-full h-8 w-28" />
      )}
      {tag}
    </div>
  );
}
