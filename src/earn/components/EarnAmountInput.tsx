import { TextInput } from '@/internal/components/TextInput';
import { isValidAmount } from '@/internal/utils/isValidAmount';
import { cn } from '@/styles/theme';
import { formatAmount } from '@/swap/utils/formatAmount';
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
          'w-full border-none bg-transparent font-display text-5xl',
          'leading-none outline-none',
        )}
        placeholder="0.0"
        value={formatAmount(value)}
        onChange={onChange}
        inputValidator={isValidAmount}
        disabled={disabled}
        aria-label={ariaLabel}
      />
    </div>
  );
}
