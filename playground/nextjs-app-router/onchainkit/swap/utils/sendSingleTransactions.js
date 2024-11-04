import { waitForTransactionReceipt } from 'wagmi/actions';
async function sendSingleTransactions({
  config,
  sendTransactionAsync,
  transactions,
  updateLifecycleStatus
}) {
  let transactionReceipt;

  // Execute the non-batched transactions sequentially
  for (const _ref of transactions) {
    const transaction = _ref.transaction;
    const transactionType = _ref.transactionType;
    updateLifecycleStatus({
      statusName: 'transactionPending'
    });
    const txHash = await sendTransactionAsync(transaction);
    updateLifecycleStatus({
      statusName: 'transactionApproved',
      statusData: {
        transactionHash: txHash,
        transactionType
      }
    });
    transactionReceipt = await waitForTransactionReceipt(config, {
      hash: txHash,
      confirmations: 1
    });
  }

  // For non-batched transactions, emit the last transaction receipt
  if (transactionReceipt) {
    updateLifecycleStatus({
      statusName: 'success',
      statusData: {
        transactionReceipt
      }
    });
  }
}
export { sendSingleTransactions };
//# sourceMappingURL=sendSingleTransactions.js.map
