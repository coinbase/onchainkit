import { useCallback } from 'react';
import { useFundSwapContext } from './FundSwapProvider';
import { TextInput } from '../../internal/components/TextInput';
import { TokenChip } from '../../token';
import { formatAmount } from '../utils/formatAmount';
import { isValidAmount } from '../../internal/utils/isValidAmount';
import { cn, pressable } from '../../styles/theme';

export function FundSwapInput() {
  const { to, handleAmountChange } = useFundSwapContext();

  const handleChange = useCallback(
    (amount: string) => {
      handleAmountChange('to', amount);
    },
    [handleAmountChange],
  );

  if (!to?.token) {
    return null;
  }

  return (
    <div className="flex items-center h-full border rounded-lg px-4">
      <TextInput
        className={cn(
          'mr-2 w-full border-[none] bg-transparent font-display',
          'leading-none outline-none',
          // hasInsufficientBalance && address ? color.error : color.foreground,
        )}
        placeholder="0.0"
        delayMs={1000}
        value={formatAmount(to.amount)}
        setValue={to.setAmount}
        disabled={to.loading}
        onChange={handleChange}
        inputValidator={isValidAmount}
      />
      <TokenChip className={pressable.inverse} token={to.token} />
    </div>
  );
}
