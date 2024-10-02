import type { TransactionDefaultReact } from '../types';
import { Transaction } from './Transaction';
import { TransactionButton } from './TransactionButton';
import { TransactionToast } from './TransactionToast';
import { TransactionToastAction } from './TransactionToastAction';
import { TransactionToastIcon } from './TransactionToastIcon';
import { TransactionToastLabel } from './TransactionToastLabel';

export function TransactionDefault({
  calls,
  capabilities,
  chainId,
  className,
  contracts,
  disabled,
  onError,
  onStatus,
  onSuccess,
}: TransactionDefaultReact) {
  return (
    <Transaction
      calls={calls}
      capabilities={capabilities}
      chainId={chainId}
      className={className}
      contracts={contracts}
      onError={onError}
      onStatus={onStatus}
      onSuccess={onSuccess}
    >
      <TransactionButton disabled={disabled} />
      <TransactionToast>
        <TransactionToastIcon />
        <TransactionToastLabel />
        <TransactionToastAction />
      </TransactionToast>
    </Transaction>
  );
}
