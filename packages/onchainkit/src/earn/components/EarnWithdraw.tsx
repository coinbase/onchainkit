'use client';
import { EarnDetails } from '@/earn/components/EarnDetails';
import type { EarnWithdrawProps } from '../types';
import { EarnCard } from './EarnCard';
import { WithdrawAmountInput } from './WithdrawAmountInput';
import { WithdrawBalance } from './WithdrawBalance';
import { WithdrawButton } from './WithdrawButton';

function EarnWithdrawDefaultContent() {
  return (
    <>
      <EarnDetails />
      <WithdrawAmountInput />
      <WithdrawBalance />
      <WithdrawButton className="-mt-4 h-12" />
    </>
  );
}

export function EarnWithdraw({
  children = <EarnWithdrawDefaultContent />,
  className,
}: EarnWithdrawProps) {
  return <EarnCard className={className}>{children}</EarnCard>;
}
