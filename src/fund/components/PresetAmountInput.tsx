import { border, cn, color, text } from '@/styles/theme';
import { useCallback, useMemo } from 'react';
import type { PresetAmountInputPropsReact } from '../types';

export function PresetAmountInput({
  presetAmountInput,
  currencyOrAsset,
  onClick,
}: PresetAmountInputPropsReact) {
  const presetAmountInputText = useMemo(() => {
    return `${presetAmountInput.value} ${currencyOrAsset}`;
  }, [presetAmountInput, currencyOrAsset]);

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

  if (!presetAmountInput.value) {
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
        'm-1 p-1',
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
