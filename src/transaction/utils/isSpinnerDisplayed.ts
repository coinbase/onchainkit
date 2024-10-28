import type { IsSpinnerDisplayedProps } from '../types';

export function isSpinnerDisplayed({
  errorMessage,
  hasReceipt,
  isInProgress,
  transactionHash,
  transactionId,
}: IsSpinnerDisplayedProps) {
  const isWaitingForReceipt = transactionId || transactionHash;

  if (hasReceipt || errorMessage) {
    return false;
  }
  if (isInProgress || isWaitingForReceipt) {
    return true;
  }
  return false;
}
