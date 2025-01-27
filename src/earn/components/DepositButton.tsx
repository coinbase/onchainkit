import { Transaction, TransactionButton } from '@/transaction';
import type { DepositButtonReact } from '../types';
import { useEarnContext } from './EarnProvider';

export function WithdrawButton({ className }: DepositButtonReact) {
  const { depositCalls } = useEarnContext();

  return (
    <Transaction className={className} calls={depositCalls}>
      <TransactionButton text="Withdraw" />
    </Transaction>
  );
}
