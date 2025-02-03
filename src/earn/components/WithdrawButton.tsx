import { Transaction, TransactionButton } from '@/transaction';
import { ConnectWallet } from '@/wallet';
import type { WithdrawButtonReact } from '../types';
import { useEarnContext } from './EarnProvider';

export function WithdrawButton({ className }: WithdrawButtonReact) {
  const { address, withdrawCalls } = useEarnContext();

  if (!address) {
    return <ConnectWallet text="Withdraw" className="w-full" />;
  }

  return (
    <Transaction className={className} calls={withdrawCalls}>
      <TransactionButton text="Withdraw" />
    </Transaction>
  );
}
