import { Capabilities } from '../../constants';
import type { ExecuteSwapTransactionParams } from '../types';
import { executeSingleTransactions } from './executeSingleTransactions';

export async function executeSwapTransactions({
  config,
  sendCallsAsync,
  sendTransactionAsync,
  setCallsId,
  updateLifecycleStatus,
  walletCapabilities,
  transactions,
}: ExecuteSwapTransactionParams) {
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
    await executeSingleTransactions({
      config,
      sendTransactionAsync,
      transactions,
      updateLifecycleStatus,
    });
  }
}
