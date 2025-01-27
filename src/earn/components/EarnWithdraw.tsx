import type { EarnWithdrawReact } from '../types';
import { EarnCard } from './EarnCard';
import { WithdrawAmountInput } from './WithdrawAmountInput';
import { WithdrawBalance } from './WithdrawBalance';
import { WithdrawDetails } from './WithdrawDetails';

export function EarnWithdraw({ children, className }: EarnWithdrawReact) {
  if (children) {
    return <EarnCard className={className}>{children}</EarnCard>;
  }

  return (
    <EarnCard className={className}>
      <WithdrawDetails />
      <WithdrawAmountInput />
      <WithdrawBalance />
      {/* TODO: add remaining components */}
    </EarnCard>
  );
}
