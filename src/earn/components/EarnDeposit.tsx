import type { EarnDepositReact } from '../types';
import { DepositAmountInput } from './DepositAmountInput';
import { DepositBalance } from './DepositBalance';
import { DepositButton } from './DepositButton';
import { DepositDetails } from './DepositDetails';
import { EarnCard } from './EarnCard';

function EarnDepositDefaultContent() {
  return (
    <>
      <DepositDetails />
      <DepositAmountInput />
      <DepositBalance />
      <DepositButton />
    </>
  );
}

export function EarnDeposit({
  children: propsChildren,
  className,
}: EarnDepositReact) {
  const children = propsChildren ?? <EarnDepositDefaultContent />;
  return <EarnCard className={className}>{children}</EarnCard>;
}
