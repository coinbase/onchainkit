import { background, border, cn, color, text } from '@/styles/theme';
import { TokenChip } from '@/token';
import type { EarnDetailsReact } from '../types';

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
      {tag && (
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
      )}
    </div>
  );
}
