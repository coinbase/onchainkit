import type { EarnDepositReact } from '../types';
import { DepositAmountInput } from './DepositAmountInput';
import { DepositBalance } from './DepositBalance';
import { DepositDetails } from './DepositDetails';
import { EarnCard } from './EarnCard';

export function EarnDeposit({ children, className }: EarnDepositReact) {
  if (children) {
    return <EarnCard className={className}>{children}</EarnCard>;
  }

  return (
    <EarnCard className={className}>
      <DepositDetails />
      <DepositAmountInput />
      <DepositBalance />
      {/* TODO: add remaining components */}
    </EarnCard>
  );
}
