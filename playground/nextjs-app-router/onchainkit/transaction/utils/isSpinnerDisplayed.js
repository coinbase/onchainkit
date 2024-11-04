function isSpinnerDisplayed({
  errorMessage,
  hasReceipt,
  isInProgress,
  transactionHash,
  transactionId
}) {
  const isWaitingForReceipt = transactionId || transactionHash;
  if (hasReceipt || errorMessage) {
    return false;
  }
  if (isInProgress || isWaitingForReceipt) {
    return true;
  }
  return false;
}
export { isSpinnerDisplayed };
//# sourceMappingURL=isSpinnerDisplayed.js.map
