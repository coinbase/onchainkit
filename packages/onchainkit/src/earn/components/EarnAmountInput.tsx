import { TextInput } from '@/internal/components/TextInput';
import { isValidAmount } from '@/internal/utils/isValidAmount';
import { cn, text } from '@/styles/theme';
import { formatToDecimalString } from '@/utils/formatter';
import type { EarnAmountInputProps } from '../types';

export function EarnAmountInput({
  className,
  disabled,
  value,
  onChange,
  'aria-label': ariaLabel,
}: EarnAmountInputProps) {
  return (
    <TextInput
      data-testid="ockEarnAmountInput"
      className={cn(
        text.base,
        'text-ock-foreground',
        'w-full border-none bg-transparent text-5xl',
        'leading-none outline-none',
        className,
      )}
      placeholder="0.0"
      value={formatToDecimalString(value)}
      onChange={onChange}
      inputValidator={isValidAmount}
      disabled={disabled}
      aria-label={ariaLabel}
    />
  );
}
