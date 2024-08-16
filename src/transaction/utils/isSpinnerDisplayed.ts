import type { IsSpinnerDisplayedProps } from '../types';

export function isSpinnerDisplayed({
  errorMessage,
  hasReceipt,
  isLoading,
  lifeCycleStatus,
  transactionHash,
  transactionId,
}: IsSpinnerDisplayedProps) {
  const isPending = lifeCycleStatus.statusName === 'transactionPending';
  const isInProgress = transactionId || transactionHash;

  if (hasReceipt || errorMessage) {
    return false;
  }
  if (isLoading || isPending || isInProgress) {
    return true;
  }
  return false;
}
