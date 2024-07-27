import type { TransactionReceipt } from 'viem';
import type { Config } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import type { SendTransactionMutateAsync } from 'wagmi/query';
import type { BuildSwapTransaction } from '../types';

export async function processSwapTransaction({
  swapTransaction,
  config,
  setPendingTransaction,
  setLoading,
  sendTransactionAsync,
  onStart,
  onSuccess,
}: {
  swapTransaction: BuildSwapTransaction;
  config: Config;
  setPendingTransaction: (value: React.SetStateAction<boolean>) => void;
  setLoading: (value: React.SetStateAction<boolean>) => void;
  sendTransactionAsync: SendTransactionMutateAsync<Config, unknown>;
  onStart: ((txHash: string) => void | Promise<void>) | undefined;
  onSuccess:
    | ((txReceipt: TransactionReceipt) => void | Promise<void>)
    | undefined;
}) {
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
    const onStartCallback = onStart?.(approveTxHash);
    if (onStartCallback instanceof Promise) {
      await onStartCallback;
    }
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
  const onStartCallback = onStart?.(txHash);
  if (onStartCallback instanceof Promise) {
    await onStartCallback;
  }

  setPendingTransaction(false);

  // wait for swap to land onchain
  setLoading(true);
  const transactionObject = await waitForTransactionReceipt(config, {
    hash: txHash,
    confirmations: 1,
  });

  // user callback
  const onSuccessCallback = onSuccess?.(transactionObject);
  if (onSuccessCallback instanceof Promise) {
    await onSuccessCallback;
  }
}
