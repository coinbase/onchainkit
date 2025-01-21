import { border, cn, color, text } from '@/styles/theme';
import { useCallback, useMemo } from 'react';
import type { PresetAmountInputItemPropsReact } from '../types';

export function FundCardPresetAmountInputItem({
  presetAmountInput,
  currency,
  onClick,
}: PresetAmountInputItemPropsReact) {
  const presetAmountInputText = useMemo(() => {
    // TODO: This is going to be formatted in the next PR where we add the currency symbol so that instead of USD we have $ or other currency symbols
    return `${presetAmountInput} ${currency}`;
  }, [presetAmountInput, currency]);

  const handleClick = useCallback(() => {
    onClick(presetAmountInput);
  }, [presetAmountInput, onClick]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick(presetAmountInput);
      }
    },
    [presetAmountInput, onClick],
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
