import { cn } from '@/styles/theme';
import { EarnAmountInputReact } from '../types';
import { TextInput } from '@/internal/components/TextInput';
import { useEarnContext } from './EarnProvider';
import { useCallback, useMemo } from 'react';
import { isValidAmount } from '@/core/utils/isValidAmount';
import { formatAmount } from '@/swap/utils/formatAmount';

export function EarnAmountInput({ className }: EarnAmountInputReact) {
  const {
    selectedTab,
    withdrawAmount,
    depositAmount,
    setWithdrawAmount,
    setDepositAmount,
  } = useEarnContext();

  const amount = useMemo(() => {
    return selectedTab === 'Deposit' ? depositAmount : withdrawAmount;
  }, [selectedTab, depositAmount, withdrawAmount]);

  const handleChange = useCallback(
    (value: string) => {
      if (selectedTab === 'Deposit') {
        setDepositAmount(value);
      } else {
        setWithdrawAmount(value);
      }
    },
    [selectedTab, setDepositAmount, setWithdrawAmount],
  );

  return (
    <div className={cn('flex flex-col', className)}>
      <TextInput
        className={cn(
          'w-full border-[none] bg-transparent font-display text-[2.5rem]',
          'leading-none outline-none',
        )}
        placeholder="0.0"
        value={formatAmount(amount)}
        onChange={handleChange}
        inputValidator={isValidAmount}
      />
    </div>
  );
}
