import { Transaction, TransactionButton } from '@/transaction';
import { ConnectWallet } from '@/wallet';
import type { DepositButtonReact } from '../types';
import { useEarnContext } from './EarnProvider';

export function DepositButton({ className }: DepositButtonReact) {
  const { address, depositCalls } = useEarnContext();

  if (!address) {
    return <ConnectWallet className="w-full" />;
  }

  return (
    <Transaction className={className} calls={depositCalls}>
      <TransactionButton text="Deposit" />
    </Transaction>
  );
}
