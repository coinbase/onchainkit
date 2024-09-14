import type { Address } from 'viem';
import { encodeFunctionData, parseAbi } from 'viem';
import { waitForTransactionReceipt } from 'wagmi/actions';
import {
  PERMIT2_CONTRACT_ADDRESS,
  UNIVERSALROUTER_CONTRACT_ADDRESS,
} from '../constants';
import type { ProcessSwapTransactionParams } from '../types';

export async function processSwapTransaction({
  config,
  sendTransactionAsync,
  updateLifecycleStatus,
  swapTransaction,
  useAggregator,
}: ProcessSwapTransactionParams) {
  const { transaction, approveTransaction, quote } = swapTransaction;

  // for swaps from ERC-20 tokens,
  // if there is an approveTransaction present,
  // request approval for the amount
  // for V1 API, `approveTx` will be an ERC-20 approval against the Router
  // for V2 API, `approveTx` will be an ERC-20 approval against the `Permit2` contract
  if (approveTransaction?.data) {
    updateLifecycleStatus({
      statusName: 'transactionPending',
    });
    const approveTxHash = await sendTransactionAsync({
      to: approveTransaction.to,
      value: approveTransaction.value,
      data: approveTransaction.data,
    });
    updateLifecycleStatus({
      statusName: 'transactionApproved',
      statusData: {
        transactionHash: approveTxHash,
        transactionType: useAggregator ? 'ERC20' : 'Permit2',
      },
    });
    await waitForTransactionReceipt(config, {
      hash: approveTxHash,
      confirmations: 1,
    });

    // for the V2 API, we use Uniswap's `UniversalRouter`, which uses `Permit2` for ERC-20 approvals
    // this adds an additional transaction/step to the swap process
    // since we need to make an extra transaction to `Permit2` to allow the UniversalRouter to spend the approved funds
    // this would typically be a (gasless) signature, but we're using a transaction here to allow batching for Smart Wallets
    // read more: https://blog.uniswap.org/permit2-and-universal-router
    if (!useAggregator) {
      updateLifecycleStatus({
        statusName: 'transactionPending',
      });
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
          20_000_000_000_000, // The deadline where the approval is no longer valid - see https://docs.uniswap.org/contracts/permit2/reference/allowance-transfer
        ],
      });
      const permitTxnHash = await sendTransactionAsync({
        to: PERMIT2_CONTRACT_ADDRESS,
        data: data,
        value: 0n,
      });
      updateLifecycleStatus({
        statusName: 'transactionApproved',
        statusData: {
          transactionHash: permitTxnHash,
          transactionType: 'ERC20',
        },
      });
      await waitForTransactionReceipt(config, {
        hash: permitTxnHash,
        confirmations: 1,
      });
    }
  }

  // make the swap
  updateLifecycleStatus({
    statusName: 'transactionPending',
  });
  const txHash = await sendTransactionAsync({
    to: transaction.to,
    value: transaction.value,
    data: transaction.data,
  });
  updateLifecycleStatus({
    statusName: 'transactionApproved',
    statusData: {
      transactionHash: txHash,
      transactionType: useAggregator ? 'ERC20' : 'Permit2',
    },
  });
  // wait for swap to land onchain
  const transactionReceipt = await waitForTransactionReceipt(config, {
    hash: txHash,
    confirmations: 1,
  });
  updateLifecycleStatus({
    statusName: 'success',
    statusData: {
      transactionReceipt: transactionReceipt,
    },
  });
}
