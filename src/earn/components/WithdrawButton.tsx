import { Transaction, TransactionButton } from '@/transaction';
import type { WithdrawButtonReact } from '../types';
import { useEarnContext } from './EarnProvider';

export function WithdrawButton({ className }: WithdrawButtonReact) {
  const { withdrawCalls } = useEarnContext();

  return (
    <Transaction className={className} calls={withdrawCalls}>
      <TransactionButton text="Withdraw" />
    </Transaction>
  );
}
