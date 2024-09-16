import type { TransactionReceipt } from 'viem';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { Capabilities } from '../../constants';
import type { ExecuteSwapTransactionParams } from '../types';

export async function executeSwapTransactions({
  config,
  sendCallsAsync,
  sendTransactionAsync,
  setCallsId,
  updateLifecycleStatus,
  walletCapabilities,
  transactions,
}: ExecuteSwapTransactionParams) {
  let transactionReceipt: TransactionReceipt | undefined;

  if (walletCapabilities[Capabilities.AtomicBatch]?.supported) {
    // For batched transactions, we'll use `SwapProvider` to listen for calls to emit the `success` state
    updateLifecycleStatus({
      statusName: 'transactionPending',
    });
    const callsId = await sendCallsAsync({
      calls: transactions,
    });
    setCallsId(callsId);
  } else {
    // Execute the non-batched transactions sequentially
    for (let i = 0; i < transactions.length; i++) {
      const tx = transactions[i];
      updateLifecycleStatus({
        statusName: 'transactionPending',
      });
      const txHash = await sendTransactionAsync(tx);
      transactionReceipt = await waitForTransactionReceipt(config, {
        hash: txHash,
        confirmations: 1,
      });

      if (transactions.length === 3) {
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
      if (i === transactions.length - 2) {
        updateLifecycleStatus({
          statusName: 'transactionApproved',
          statusData: {
            transactionHash: txHash,
            transactionType: 'ERC20',
          },
        });
      }
    }
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
