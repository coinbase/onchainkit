import type { IsSpinnerDisplayedProps } from '../types';

export function isSpinnerDisplayed({
  errorMessage,
  hasReceipt,
  isLoading,
  lifecycleStatus,
  transactionHash,
  transactionId,
}: IsSpinnerDisplayedProps) {
  const isPending = lifecycleStatus.statusName === 'transactionPending';
  const isInProgress = transactionId || transactionHash;

  if (hasReceipt || errorMessage) {
    return false;
  }
  if (isLoading || isPending || isInProgress) {
    return true;
  }
  return false;
}
