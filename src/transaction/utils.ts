type IsSpinnerDisplayedProps = {
  errorMessage?: string;
  hasReceipt?: boolean;
  isLoading?: boolean;
  statusWriteContract?: string;
  statusWriteContracts?: string;
  transactionHash?: string;
  transactionId?: string;
};

export function isSpinnerDisplayed({
  errorMessage,
  hasReceipt,
  isLoading,
  statusWriteContract,
  statusWriteContracts,
  transactionHash,
  transactionId,
}: IsSpinnerDisplayedProps) {
  if (hasReceipt) {
    return false;
  }
  if (errorMessage) {
    return false;
  }

  if (isLoading) {
    return true;
  }

  if (statusWriteContract === 'pending' || statusWriteContracts === 'pending') {
    return true;
  }
  // there is a delay between when txn is confirmed and
  // call status returns isLoading true so this
  // condition keeps spinner visible during that time
  if (transactionId || transactionHash) {
    return true;
  }

  return false;
}
