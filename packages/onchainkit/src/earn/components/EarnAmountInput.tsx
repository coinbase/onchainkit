import { TextInput } from '@/internal/components/TextInput';
import { isValidAmount } from '@/internal/utils/isValidAmount';
import { cn, text } from '@/styles/theme';
import { formatMaybeScientificNotationToDecimal } from '@/utils/formatter';
import type { EarnAmountInputReact } from '../types';

export function EarnAmountInput({
  className,
  disabled,
  value,
  onChange,
  'aria-label': ariaLabel,
}: EarnAmountInputReact) {
  return (
    <div
      data-testid="ockEarnAmountInput"
      className={cn('flex flex-col', className)}
    >
      <TextInput
        className={cn(
          text.base,
          'text-ock-text-foreground',
          'w-full border-none bg-transparent text-5xl',
          'leading-none outline-none',
        )}
        placeholder="0.0"
        value={formatMaybeScientificNotationToDecimal(value)}
        onChange={onChange}
        inputValidator={isValidAmount}
        disabled={disabled}
        aria-label={ariaLabel}
      />
    </div>
  );
}
