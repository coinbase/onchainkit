import { formatFiatAmount } from '@/internal/utils/formatFiatAmount';
import { border, cn, color, text } from '@/styles/theme';
import { useCallback, useMemo } from 'react';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { FundEvent } from '../../core/analytics/types';
import type { PresetAmountInputItemPropsReact } from '../types';

export function FundCardPresetAmountInputItem({
  presetAmountInput,
  currency,
  onClick,
}: PresetAmountInputItemPropsReact) {
  const { sendAnalytics } = useAnalytics();

  const presetAmountInputText = useMemo(() => {
    return formatFiatAmount({
      amount: presetAmountInput,
      currency,
      minimumFractionDigits: 0,
    });
  }, [presetAmountInput, currency]);

  const handleClick = useCallback(() => {
    sendAnalytics(FundEvent.FundAmountChanged, {
      amount: Number(presetAmountInput),
      currency,
    });
    onClick(presetAmountInput);
  }, [presetAmountInput, currency, onClick, sendAnalytics]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        sendAnalytics(FundEvent.FundAmountChanged, {
          amount: Number(presetAmountInput),
          currency,
        });
        onClick(presetAmountInput);
      }
    },
    [presetAmountInput, currency, onClick, sendAnalytics],
  );

  if (!presetAmountInput) {
    return null;
  }

  return (
    <button
      type="button"
      data-testid="ockPresetAmountInput"
      className={cn(
        text.body,
        color.foreground,
        border.radius,
        border.lineDefault,
        'flex-1',
        'p-1',
        'overflow-hidden',
        'whitespace-nowrap',
        'text-ellipsis',
        'hover:bg-[var(--ock-bg-default-hover)]',
        'focus:outline-none focus:ring-2',
      )}
      title={presetAmountInputText}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
    >
      {presetAmountInputText}
    </button>
  );
}
