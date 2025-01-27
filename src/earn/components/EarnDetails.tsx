import { background, border, cn, color, text } from '@/styles/theme';
import { EarnDetailsReact } from '../types';
import { TokenChip } from '@/token';

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
      className={cn(
        border.radius,
        'flex items-center gap-4 w-full justify-between',
        className,
      )}
    >
      <TokenChip
        className={'!bg-[transparent]'}
        token={token}
        isPressable={false}
      />
      {tag && (
        <div
          className={cn(
            text.label1,
            tagVariant === 'default' ? color.foregroundMuted : color.primary,
            tagVariant === 'default' ? background.alternate : background.washed,
            'p-1 px-3 rounded-full flex items-center justify-center',
          )}
        >
          {tag}
        </div>
      )}
    </div>
  );
}
