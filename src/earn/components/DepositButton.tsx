import {
  type LifecycleStatus,
  Transaction,
  TransactionButton,
} from '@/transaction';
import { ConnectWallet } from '@/wallet';
import type { DepositButtonReact } from '../types';
import { useEarnContext } from './EarnProvider';
import { useCallback } from 'react';

export function DepositButton({ className }: DepositButtonReact) {
  const { address, depositCalls, updateLifecycleStatus } = useEarnContext();

  if (!address) {
    return <ConnectWallet className="w-full" />;
  }

  const handleOnStatus = useCallback(
    (status: LifecycleStatus) => {
      updateLifecycleStatus(status);
    },
    [updateLifecycleStatus],
  );

  return (
    <Transaction
      className={className}
      calls={depositCalls}
      onStatus={handleOnStatus}
    >
      <TransactionButton text="Deposit" />
    </Transaction>
  );
}
