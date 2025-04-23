import { normalizeTransactionId } from '@/internal/utils/normalizeWagmi';
import { Capabilities } from '../../core/constants';
import type { SendSwapTransactionParams } from '../types';
import { sendSingleTransactions } from './sendSingleTransactions';

export async function sendSwapTransactions({
  config,
  isSponsored,
  paymaster,
  sendCallsAsync,
  sendTransactionAsync,
  updateLifecycleStatus,
  walletCapabilities,
  transactions,
}: SendSwapTransactionParams) {
  if (walletCapabilities[Capabilities.AtomicBatch]?.supported) {
    // For batched transactions, we'll use `SwapProvider` to listen for calls to emit the `success` state
    updateLifecycleStatus({
      statusName: 'transactionPending',
    });
    const data = await sendCallsAsync({
      calls: transactions.map(({ transaction }) => transaction),
      capabilities: isSponsored
        ? {
            paymasterService: {
              url: paymaster,
            },
          }
        : {},
    });
    updateLifecycleStatus({
      statusName: 'transactionApproved',
      statusData: {
        callsId: normalizeTransactionId(data) as `0x${string}`,
        transactionType: 'Batched',
      },
    });
  } else {
    await sendSingleTransactions({
      config,
      sendTransactionAsync,
      transactions,
      updateLifecycleStatus,
    });
  }
}
