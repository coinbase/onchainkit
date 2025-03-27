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
  for (const { transaction, transactionType } of transactions) {
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
