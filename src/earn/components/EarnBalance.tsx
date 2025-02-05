import { useEarnContext } from '@/earn/components/EarnProvider';
import { background, border, cn, color, text } from '@/styles/theme';
import type { EarnBalanceReact } from '../types';

export function EarnBalance({
  className,
  onActionPress,
  title,
  subtitle,
  showAction = false,
}: EarnBalanceReact) {
  const { convertedBalance } = useEarnContext();
  return (
    <div
      className={cn(
        background.alternate,
        border.radius,
        'flex items-center justify-between gap-4 p-3 px-4',
        className,
      )}
      data-testid="ockEarnBalance"
    >
      <div className={cn('flex flex-col', color.foreground)}>
        <div className={text.headline}>{title}</div>
        <div className={cn(text.label2, color.foregroundMuted)}>{subtitle}</div>
      </div>
      {showAction && convertedBalance && Number(convertedBalance) > 0 && (
        <button
          onClick={onActionPress}
          className={cn(text.label2, color.primary)}
          type="button"
          aria-label="Use max"
        >
          Use max
        </button>
      )}
    </div>
  );
}
