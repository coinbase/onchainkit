import { Transaction, TransactionButton } from '@/transaction';
import { ConnectWallet } from '@/wallet';
import type { DepositButtonReact } from '../types';
import { useEarnContext } from './EarnProvider';

export function DepositButton({ className }: DepositButtonReact) {
  const { address, depositCalls } = useEarnContext();
  console.log('depositCalls:', depositCalls);

  if (!address) {
    return <ConnectWallet text="Deposit" />;
  }

  return (
    <Transaction
      className={className}
      calls={depositCalls}
      onError={(e) => console.log(e)}
    >
      <TransactionButton text="Deposit" />
    </Transaction>
  );
}
