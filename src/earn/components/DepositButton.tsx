import {
  type LifecycleStatus,
  Transaction,
  TransactionButton,
} from '@/transaction';
import { ConnectWallet } from '@/wallet';
import type { DepositButtonReact } from '../types';
import { useEarnContext } from './EarnProvider';
import { useCallback } from 'react';

const lifecycleStatusesToPropagate = [
  'transactionPending',
  'transactionLegacyExecuted',
  'success',
  'error',
];

export function DepositButton({ className }: DepositButtonReact) {
  const { address, depositCalls, updateLifecycleStatus } = useEarnContext();

  if (!address) {
    return <ConnectWallet className="w-full" />;
  }

  const handleStatus = useCallback(
    (status: LifecycleStatus) => {
      if (lifecycleStatusesToPropagate.includes(status.statusName)) {
        updateLifecycleStatus(status);
      }
    },
    [updateLifecycleStatus],
  );

  return (
    <Transaction className={className} calls={depositCalls}>
      <TransactionButton text="Deposit" onStatus={handleStatus} />
    </Transaction>
  );
}
