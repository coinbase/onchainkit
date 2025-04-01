'use client';
import type { DepositAmountInputReact } from '../types';
import { EarnAmountInput } from './EarnAmountInput';
import { useEarnContext } from './EarnProvider';

export function DepositAmountInput({ className }: DepositAmountInputReact) {
  const { depositAmount, setDepositAmount } = useEarnContext();

  return (
    <EarnAmountInput
      className={className}
      value={depositAmount}
      onChange={setDepositAmount}
      aria-label="Deposit Amount"
    />
  );
}
