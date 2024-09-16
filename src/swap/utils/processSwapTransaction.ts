import type { Address, TransactionReceipt } from 'viem';
import { encodeFunctionData, parseAbi } from 'viem';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { Capabilities } from '../../constants';
import type { Call } from '../../transaction/types';
import {
  PERMIT2_CONTRACT_ADDRESS,
  UNIVERSALROUTER_CONTRACT_ADDRESS,
} from '../constants';
import type { ProcessSwapTransactionParams } from '../types';

export async function processSwapTransaction({
  config,
  sendCallsAsync,
  sendTransactionAsync,
  setCallsId,
  updateLifecycleStatus,
  swapTransaction,
  useAggregator,
  walletCapabilities,
}: ProcessSwapTransactionParams) {
  const { transaction, approveTransaction, quote } = swapTransaction;
  const transactions: Call[] = [];

  // for swaps from ERC-20 tokens,
  // if there is an approveTransaction present,
  // request approval for the amount
  // for V1 API, `approveTx` will be an ERC-20 approval against the Router
  // for V2 API, `approveTx` will be an ERC-20 approval against the `Permit2` contract
  if (approveTransaction?.data) {
    transactions.push({
      to: approveTransaction.to,
      value: approveTransaction.value,
      data: approveTransaction.data,
    });

    // for the V2 API, we use Uniswap's `UniversalRouter`, which uses `Permit2` for ERC-20 approvals
    // this adds an additional transaction/step to the swap process
    // since we need to make an extra transaction to `Permit2` to allow the UniversalRouter to spend the approved funds
    // this would typically be a (gasless) signature, but we're using a transaction here to allow batching for Smart Wallets
    // read more: https://blog.uniswap.org/permit2-and-universal-router
    if (!useAggregator) {
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
      transactions.push({
        to: PERMIT2_CONTRACT_ADDRESS,
        value: 0n,
        data: data,
      });
    }
  }
  // The Swap Execution Transaction
  transactions.push({
    to: transaction.to,
    value: transaction.value,
    data: transaction.data,
  });

  let transactionReceipt: TransactionReceipt | undefined;
  if (walletCapabilities[Capabilities.AtomicBatch]?.supported) {
    // For batched transactions, we'll use `SwapProvider` to listen for calls to emit the `success` state
    // We have to do this due to an error with Wagmi's `getCallsStatus` not sending requests properly to the Wallet server - https://wagmi.sh/core/api/actions/getCallsStatus
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
      if (i === transactions.length - 2) {
        updateLifecycleStatus({
          statusName: 'transactionApproved',
          statusData: {
            transactionHash: txHash,
            transactionType: useAggregator ? 'ERC20' : 'Permit2',
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
