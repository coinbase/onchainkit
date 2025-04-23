'use client';
import type { WithdrawAmountInputReact } from '../types';
import { EarnAmountInput } from './EarnAmountInput';
import { useEarnContext } from './EarnProvider';

export function WithdrawAmountInput({ className }: WithdrawAmountInputReact) {
  const { withdrawAmount, setWithdrawAmount } = useEarnContext();

  return (
    <EarnAmountInput
      className={className}
      value={withdrawAmount}
      onChange={setWithdrawAmount}
      aria-label="Withdraw Amount"
    />
  );
}
