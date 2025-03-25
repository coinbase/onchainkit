import type { TransactionDefaultReact } from '../types';
import { Transaction } from './Transaction';

/**
 * @deprecated Use the `Transaction` component instead with no 'children' props.
 */
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
      disabled={disabled}
      contracts={contracts}
      onError={onError}
      onStatus={onStatus}
      onSuccess={onSuccess}
    />
  );
}
