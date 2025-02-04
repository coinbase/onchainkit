import { background, border, cn, color, text } from '@/styles/theme';
import { TokenChip } from '@/token';
import type { EarnDetailsReact } from '../types';
import { Skeleton } from '@/internal/components/Skeleton';

export function EarnDetails({
  className,
  token,
  tag,
  tagVariant = 'default',
}: EarnDetailsReact) {
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
      {tag ? (
        <div
          className={cn(
            text.label1,
            tagVariant === 'default' ? color.foregroundMuted : color.primary,
            tagVariant === 'default' ? background.alternate : background.washed,
            'flex items-center justify-center rounded-full p-1 px-3',
          )}
        >
          {tag}
        </div>
      ) : (
        <Skeleton className="!rounded-full h-7 min-w-28" />
      )}
    </div>
  );
}
