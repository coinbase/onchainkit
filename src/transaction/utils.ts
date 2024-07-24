type IsSpinnerDisplayedProps = {
  errorMessage?: string;
  isLoading?: boolean;
  status?: string;
  transactionHash?: string;
  transactionId?: string;
};

export function isSpinnerDisplayed({
  errorMessage,
  isLoading,
  status,
  transactionHash,
  transactionId,
}: IsSpinnerDisplayedProps) {
  if (transactionHash) {
    return false;
  }
  if (errorMessage) {
    return false;
  }
  if (isLoading) {
    return true;
  }
  if (status === 'pending') {
    return true;
  }
  // there is a delay between when txn is confirmed and
  // call status returns isLoading true so this
  // condition keeps spinner visible during that time
  if (transactionId) {
    return true;
  }
  return false;
}
