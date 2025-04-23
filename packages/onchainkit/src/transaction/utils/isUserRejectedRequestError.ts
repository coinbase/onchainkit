import type { TransactionExecutionError } from 'viem';

export function isUserRejectedRequestError(err: unknown) {
  if (
    (err as TransactionExecutionError)?.cause?.name ===
    'UserRejectedRequestError'
  ) {
    return true;
  }
  if (
    (err as TransactionExecutionError)?.shortMessage?.includes(
      'User rejected the request.',
    )
  ) {
    return true;
  }
  return false;
}
