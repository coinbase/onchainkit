import type { EarnWithdrawReact } from '../types';
import { EarnCard } from './EarnCard';
import { WithdrawAmountInput } from './WithdrawAmountInput';
import { WithdrawBalance } from './WithdrawBalance';
import { WithdrawButton } from './WithdrawButton';
import { WithdrawDetails } from './WithdrawDetails';

function EarnWithdrawDefaultContent() {
  return (
    <>
      <WithdrawDetails />
      <WithdrawAmountInput />
      <WithdrawBalance />
      <WithdrawButton />
    </>
  );
}

export function EarnWithdraw({
  children = <EarnWithdrawDefaultContent />,
  className,
}: EarnWithdrawReact) {
  return <EarnCard className={className}>{children}</EarnCard>;
}
