import { TRANSACTION_TYPE_CALLS } from '../constants.js';
const sendSingleTransactions = async ({
  sendCallAsync,
  transactions,
  transactionType,
  writeContractAsync
}) => {
  for (const transaction of transactions) {
    if (transactionType === TRANSACTION_TYPE_CALLS) {
      await sendCallAsync(transaction);
    } else {
      await writeContractAsync(transaction);
    }
  }
};
export { sendSingleTransactions };
//# sourceMappingURL=sendSingleTransactions.js.map
