import { formatFiatAmount } from '@/internal/utils/formatFiatAmount';
import { border, cn, text } from '@/styles/theme';
import { useCallback, useMemo } from 'react';
import { FundEvent } from '../../core/analytics/types';
import type { PresetAmountInputItemProps } from '../types';
import { sendOCKAnalyticsEvent } from '@/core/analytics/utils/sendAnalytics';

export function FundCardPresetAmountInputItem({
  presetAmountInput,
  currency,
  onClick,
}: PresetAmountInputItemProps) {
  const presetAmountInputText = useMemo(() => {
    return formatFiatAmount({
      amount: presetAmountInput,
      currency,
      minimumFractionDigits: 0,
    });
  }, [presetAmountInput, currency]);

  const handleClick = useCallback(() => {
    sendOCKAnalyticsEvent(FundEvent.FundAmountChanged, {
      amount: Number(presetAmountInput),
      currency,
    });
    onClick(presetAmountInput);
  }, [presetAmountInput, currency, onClick]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        sendOCKAnalyticsEvent(FundEvent.FundAmountChanged, {
          amount: Number(presetAmountInput),
          currency,
        });
        onClick(presetAmountInput);
      }
    },
    [presetAmountInput, currency, onClick],
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
        'text-ock-text-foreground',
        'rounded-ock-default',
        border.lineDefault,
        'flex-1',
        'p-1',
        'overflow-hidden',
        'whitespace-nowrap',
        'text-ellipsis',
        'hover:bg-ock-bg-default-hover',
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
