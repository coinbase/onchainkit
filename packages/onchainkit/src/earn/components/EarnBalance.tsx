import { cn, text } from '@/styles/theme';
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
        'bg-ock-bg-alternate',
        'rounded-ock-default flex items-center justify-between gap-4 p-3 px-4',
        className,
      )}
      data-testid="ockEarnBalance"
    >
      <div className={cn('flex flex-col', 'text-ock-text-foreground')}>
        <div className={text.headline}>{title}</div>
        <div className={cn(text.label2, 'text-ock-text-foreground-muted')}>
          {subtitle}
        </div>
      </div>
      {showAction && (
        <button
          onClick={onActionPress}
          className={cn(text.label2, 'text-ock-text-primary')}
          type="button"
          aria-label="Use max"
        >
          Use max
        </button>
      )}
    </div>
  );
}
