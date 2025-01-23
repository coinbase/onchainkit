import { cn } from '@/styles/theme';
import { EarnAmountInputReact } from '../types';
import { TextInput } from '@/internal/components/TextInput';
import { isValidAmount } from '@/core/utils/isValidAmount';
import { formatAmount } from '@/swap/utils/formatAmount';

export function EarnAmountInput({
  className,
  disabled,
  value,
  onChange,
}: EarnAmountInputReact) {
  return (
    <div className={cn('flex flex-col', className)}>
      <TextInput
        className={cn(
          'w-full border-[none] bg-transparent font-display text-[2.5rem]',
          'leading-none outline-none',
        )}
        placeholder="0.0"
        value={formatAmount(value)}
        onChange={onChange}
        inputValidator={isValidAmount}
        disabled={disabled}
      />
    </div>
  );
}
