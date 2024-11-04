import { useCallback } from 'react';
import { Capabilities } from '../../constants.js';
import { sendBatchedTransactions } from '../utils/sendBatchedTransactions.js';
import { sendSingleTransactions } from '../utils/sendSingleTransactions.js';

// Sends transactions to the wallet using the appropriate hook based on Transaction props and wallet capabilities
const useSendWalletTransactions = ({
  capabilities,
  sendCallAsync,
  sendCallsAsync,
  transactionType,
  walletCapabilities,
  writeContractAsync,
  writeContractsAsync
}) => {
  return useCallback(async transactions => {
    if (!transactions) {
      return;
    }
    const resolvedTransactions = await Promise.resolve(transactions);
    if (walletCapabilities[Capabilities.AtomicBatch]?.supported) {
      // Batched transactions
      await sendBatchedTransactions({
        capabilities,
        sendCallsAsync,
        transactions: resolvedTransactions,
        transactionType,
        writeContractsAsync
      });
    } else {
      // Non-batched transactions
      await sendSingleTransactions({
        sendCallAsync,
        transactions: resolvedTransactions,
        transactionType,
        writeContractAsync
      });
    }
  }, [writeContractsAsync, writeContractAsync, sendCallsAsync, sendCallAsync, capabilities, transactionType, walletCapabilities]);
};
export { useSendWalletTransactions };
//# sourceMappingURL=useSendWalletTransactions.js.map
