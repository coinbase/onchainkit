import type { TransactionReceipt } from 'viem';
import type { Config } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import type { SendTransactionMutateAsync } from 'wagmi/query';
import type { BuildSwapTransaction, SwapHooks } from '../types';

export async function processSwapTransaction({
  swapTransaction,
  config,
  setPendingTransaction,
  setLoading,
  sendTransactionAsync,
  onSuccess,
  onStatus,
}: {
  swapTransaction: BuildSwapTransaction;
  config: Config;
  setPendingTransaction: (value: React.SetStateAction<boolean>) => void;
  setLoading: (value: React.SetStateAction<boolean>) => void;
  sendTransactionAsync: SendTransactionMutateAsync<Config, unknown>;
  onSuccess:
    | ((txReceipt: TransactionReceipt) => void | Promise<void>)
    | undefined;
  onStatus: SwapHooks | undefined;
}) {
  const { onStart, onSuccess: onStatusSuccess } = onStatus ?? {};
  const { transaction, approveTransaction } = swapTransaction;

  // for swaps from ERC-20 tokens,
  // if there is an approveTransaction present,
  // request approval for the amount
  if (approveTransaction?.data) {
    setPendingTransaction(true);
    const approveTxHash = await sendTransactionAsync({
      to: approveTransaction.to,
      value: approveTransaction.value,
      data: approveTransaction.data,
    });
    await Promise.resolve(onStart?.(approveTxHash));
    await waitForTransactionReceipt(config, {
      hash: approveTxHash,
      confirmations: 1,
    });
    setPendingTransaction(false);
  }

  // make the swap
  setPendingTransaction(true);
  const txHash = await sendTransactionAsync({
    to: transaction.to,
    value: transaction.value,
    data: transaction.data,
  });
  await Promise.resolve(onStart?.(txHash));

  setPendingTransaction(false);

  // wait for swap to land onchain
  setLoading(true);
  const transactionObject = await waitForTransactionReceipt(config, {
    hash: txHash,
    confirmations: 1,
  });

  // user success callbacks
  await Promise.resolve(onSuccess?.(transactionObject));
  await Promise.resolve(onStatusSuccess?.(transactionObject));
}
