import { TextInput } from '@/internal/components/TextInput';
import { isValidAmount } from '@/internal/utils/isValidAmount';
import { cn, text } from '@/styles/theme';
import { formatAmount } from '@/swap/utils/formatAmount';
import type { EarnAmountInputReact } from '../types';
import { useTheme } from '@/internal/hooks/useTheme';

export function EarnAmountInput({
  className,
  disabled,
  value,
  onChange,
  'aria-label': ariaLabel,
}: EarnAmountInputReact) {
  const theme = useTheme();
  return (
    <div
      data-testid="ockEarnAmountInput"
      className={cn('flex flex-col', className)}
    >
      <TextInput
        className={cn(
          'ock-font-family w-full border-none bg-transparent text-5xl',
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
