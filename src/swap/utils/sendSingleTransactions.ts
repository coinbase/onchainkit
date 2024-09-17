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
    const tx = transactions[i];
    updateLifecycleStatus({
      statusName: 'transactionPending',
    });
    const txHash = await sendTransactionAsync(tx);

    if (transactions.length === 3) {
      // Permit2 has 3 transactions, 2nd to last is the `Permit2` approval
      if (i === transactions.length - 3) {
        updateLifecycleStatus({
          statusName: 'transactionApproved',
          statusData: {
            transactionHash: txHash,
            transactionType: 'Permit2',
          },
        });
      }
    }
    // 2nd to last transaction is the `ERC20` approval
    if (i === transactions.length - 2) {
      updateLifecycleStatus({
        statusName: 'transactionApproved',
        statusData: {
          transactionHash: txHash,
          transactionType: 'ERC20',
        },
      });
    }

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
