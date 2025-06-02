import { TextInput } from '@/internal/components/TextInput';
import { isValidAmount } from '@/internal/utils/isValidAmount';
import { cn, text } from '@/styles/theme';
import { formatAmount } from '@/swap/utils/formatAmount';
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
      testID="ockEarnAmountInput"
      className={cn(
        text.base,
        'text-ock-text-foreground',
        'w-full border-none bg-transparent text-5xl',
        'leading-none outline-none',
        className,
      )}
      placeholder="0.0"
      value={formatAmount(value)}
      onChange={onChange}
      inputValidator={isValidAmount}
      disabled={disabled}
      aria-label={ariaLabel}
    />
  );
}
