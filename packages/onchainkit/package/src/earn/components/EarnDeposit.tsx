'use client';
import { EarnDetails } from '@/earn/components/EarnDetails';
import type { EarnDepositReact } from '../types';
import { DepositAmountInput } from './DepositAmountInput';
import { DepositBalance } from './DepositBalance';
import { DepositButton } from './DepositButton';
import { EarnCard } from './EarnCard';

function EarnDepositDefaultContent() {
  return (
    <>
      <EarnDetails />
      <DepositAmountInput />
      <DepositBalance />
      <DepositButton className="-mt-4 h-12" />
    </>
  );
}

export function EarnDeposit({
  children = <EarnDepositDefaultContent />,
  className,
}: EarnDepositReact) {
  return <EarnCard className={className}>{children}</EarnCard>;
}
