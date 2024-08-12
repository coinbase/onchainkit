import type { IsSpinnerDisplayedProps } from '../types';

export function isSpinnerDisplayed({
  errorMessage,
  hasReceipt,
  isLoading,
  statusSingle,
  statusBatched,
  transactionHash,
  transactionId,
}: IsSpinnerDisplayedProps) {
  const isPending = statusSingle === 'pending' || statusBatched === 'pending';
  const isInProgress = transactionId || transactionHash;

  if (hasReceipt || errorMessage) {
    return false;
  }
  if (isLoading || isPending || isInProgress) {
    return true;
  }
  return false;
}
