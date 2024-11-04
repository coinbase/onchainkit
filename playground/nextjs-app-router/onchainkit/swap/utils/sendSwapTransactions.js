import { Capabilities } from '../../constants.js';
import { sendSingleTransactions } from './sendSingleTransactions.js';
async function sendSwapTransactions({
  config,
  isSponsored,
  paymaster,
  sendCallsAsync,
  sendTransactionAsync,
  updateLifecycleStatus,
  walletCapabilities,
  transactions
}) {
  if (walletCapabilities[Capabilities.AtomicBatch]?.supported) {
    // For batched transactions, we'll use `SwapProvider` to listen for calls to emit the `success` state
    updateLifecycleStatus({
      statusName: 'transactionPending'
    });
    const callsId = await sendCallsAsync({
      calls: transactions.map(({
        transaction
      }) => transaction),
      capabilities: isSponsored ? {
        paymasterService: {
          url: paymaster
        }
      } : {}
    });
    updateLifecycleStatus({
      statusName: 'transactionApproved',
      statusData: {
        callsId,
        transactionType: 'Batched'
      }
    });
  } else {
    await sendSingleTransactions({
      config,
      sendTransactionAsync,
      transactions,
      updateLifecycleStatus
    });
  }
}
export { sendSwapTransactions };
//# sourceMappingURL=sendSwapTransactions.js.map
