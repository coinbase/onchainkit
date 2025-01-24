import { background, border, cn, color, text } from '@/styles/theme';
import { useCallback } from 'react';
import type { EarnBalanceReact } from '../types';

export function EarnBalance({
  className,
  onActionPress,
  title,
  subtitle,
  showAction = false,
}: EarnBalanceReact) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onActionPress();
      }
    },
    [onActionPress],
  );

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
      {showAction && (
        <button
          onClick={onActionPress}
          className={cn(text.label2, color.primary)}
          type="button"
          onKeyDown={handleKeyDown}
        >
          Use max
        </button>
      )}
    </div>
  );
}
