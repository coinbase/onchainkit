'use client';
import { TextInput } from '../../internal/components/TextInput';
import { isValidAmount } from '../../internal/utils/isValidAmount';
import { border, cn } from '../../styles/theme';
import { formatToDecimalString } from '@/utils/formatter';
import { TokenChip } from '../../token';
import { useBuyContext } from './BuyProvider';

export function BuyAmountInput() {
  const { to, handleAmountChange } = useBuyContext();

  if (!to?.token) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex h-12 items-center border px-2 pl-4',
        'bg-ock-background',
        'rounded-ock-default',
        border.lineDefault,
      )}
    >
      <TextInput
        className={cn(
          'mr-2 w-full border-none font-display',
          'leading-none outline-none disabled:cursor-not-allowed',
          'bg-ock-background',
          'text-ock-foreground',
        )}
        placeholder="0.0"
        delayMs={1000}
        inputMode="decimal"
        value={formatToDecimalString(to.amount)}
        setValue={to.setAmount}
        disabled={to.loading}
        onChange={handleAmountChange}
        inputValidator={isValidAmount}
      />
      <TokenChip
        className={cn('text-ock-foreground', 'rounded-md')}
        token={to.token}
        isPressable={false}
      />
    </div>
  );
}
