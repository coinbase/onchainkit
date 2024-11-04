import { TRANSACTION_TYPE_CONTRACTS, TRANSACTION_TYPE_CALLS } from '../constants.js';
const sendBatchedTransactions = async ({
  capabilities,
  sendCallsAsync,
  transactions,
  transactionType,
  writeContractsAsync
}) => {
  if (!transactions) {
    return;
  }
  if (transactionType === TRANSACTION_TYPE_CONTRACTS) {
    await writeContractsAsync({
      contracts: transactions,
      capabilities
    });
  }
  if (transactionType === TRANSACTION_TYPE_CALLS) {
    await sendCallsAsync({
      calls: transactions,
      capabilities
    });
  }
};
export { sendBatchedTransactions };
//# sourceMappingURL=sendBatchedTransactions.js.map
