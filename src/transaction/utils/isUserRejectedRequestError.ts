import type { TransactionExecutionError } from 'viem';

export function isUserRejectedRequestError(err: unknown) {
  return (
    (err as TransactionExecutionError)?.cause?.name ===
    'UserRejectedRequestError'
  );
}
