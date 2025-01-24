import { background, border, cn, color, text } from '@/styles/theme';
import type { EarnBalanceReact } from '../types';

export function EarnBalance({
  className,
  onActionPress,
  title,
  subtitle,
  showAction = false,
}: EarnBalanceReact) {
  return (
    <div
      className={cn(
        background.alternate,
        border.radius,
        'flex p-3 px-4 items-center gap-4 justify-between',
        className,
      )}
      data-testid="ockEarnBalance"
    >
      <div className={cn('flex flex-col', color.foreground)}>
        <div className={text.headline}>{title}</div>
        <div className={cn(text.label2, color.foregroundMuted)}>{subtitle}</div>
      </div>
      {showAction && (
        <div onClick={onActionPress} className={cn(text.label2, color.primary)}>
          Use max
        </div>
      )}
    </div>
  );
}
