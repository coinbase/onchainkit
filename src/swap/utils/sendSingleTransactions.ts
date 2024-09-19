import type { TransactionReceipt } from 'viem';
import { waitForTransactionReceipt } from 'wagmi/actions';
import type { SendSingleTransactionsParams } from '../types';

export async function sendSingleTransactions({
  config,
  sendTransactionAsync,
  transactions,
  updateLifecycleStatus,
}: SendSingleTransactionsParams) {
  let transactionReceipt: TransactionReceipt | undefined;

  // Execute the non-batched transactions sequentially
  for (let i = 0; i < transactions.length; i++) {
    const { transaction, transactionType } = transactions[i];
    updateLifecycleStatus({
      statusName: 'transactionPending',
    });
    const txHash = await sendTransactionAsync(transaction);
    updateLifecycleStatus({
      statusName: 'transactionApproved',
      statusData: { transactionHash: txHash, transactionType },
    });
    transactionReceipt = await waitForTransactionReceipt(config, {
      hash: txHash,
      confirmations: 1,
    });
  }

  // For non-batched transactions, emit the last transaction receipt
  if (transactionReceipt) {
    updateLifecycleStatus({
      statusName: 'success',
      statusData: {
        transactionReceipt,
      },
    });
  }
}
