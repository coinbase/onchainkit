import type { Address, TransactionReceipt } from 'viem';
import type { Config } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import type { SendTransactionMutateAsync } from 'wagmi/query';
import {
  UNIVERSALROUTER_CONTRACT_ADDRESS,
  PERMIT2_CONTRACT_ADDRESS,
} from '../constants';
import type { BuildSwapTransaction } from '../types';
import { encodeFunctionData, parseAbi } from 'viem';

export async function processSwapTransaction({
  swapTransaction,
  config,
  setPendingTransaction,
  setLoading,
  sendTransactionAsync,
  onStart,
  onSuccess,
  useAggregator,
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
  useAggregator: boolean;
}) {
  const { transaction, approveTransaction, quote } = swapTransaction;

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

    // for the V2 API, we use Uniswap's UniversalRouter
    // this adds an additional transaction/step to the swap process
    // the `approveTx` on the response will be an approval for the amount of the `from` token against `Permit2`, instead of an approval against the Router itself
    // we also need to make an extra transaction to `Permit2` to approve the UniversalRouter to spend the funds
    // read more: https://blog.uniswap.org/permit2-and-universal-router
    if (!useAggregator) {
      setPendingTransaction(true);
      const permit2ContractAbi = parseAbi([
        'function approve(address token, address spender, uint160 amount, uint48 expiration) external',
      ]);
      const data = encodeFunctionData({
        abi: permit2ContractAbi,
        functionName: 'approve',
        args: [
          quote.from.address as Address,
          UNIVERSALROUTER_CONTRACT_ADDRESS,
          BigInt(quote.fromAmount),
          20_000_000_000_000,
        ],
      });
      const permitTxnHash = await sendTransactionAsync({
        to: PERMIT2_CONTRACT_ADDRESS,
        data: data,
        value: 0n,
      });
      await Promise.resolve(onStart?.(permitTxnHash));
      await waitForTransactionReceipt(config, {
        hash: permitTxnHash,
        confirmations: 1,
      });
      setPendingTransaction(false);
    }
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

  // user callback
  await Promise.resolve(onSuccess?.(transactionObject));
}
