'use client';
import type { DepositAmountInputProps } from '../types';
import { EarnAmountInput } from './EarnAmountInput';
import { useEarnContext } from './EarnProvider';

export function DepositAmountInput({ className }: DepositAmountInputProps) {
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
