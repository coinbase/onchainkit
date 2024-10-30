import type { Address } from 'viem';
import { encodeFunctionData, parseAbi } from 'viem';
import { base } from 'viem/chains';
import {
  PERMIT2_CONTRACT_ADDRESS,
  UNIVERSALROUTER_CONTRACT_ADDRESS,
} from '../constants';
import type { ProcessSwapTransactionParams, SwapTransaction } from '../types';
import { sendSwapTransactions } from './sendSwapTransactions';

export async function processSwapTransaction({
  chainId,
  config,
  isSponsored,
  paymaster,
  sendCallsAsync,
  sendTransactionAsync,
  swapTransaction,
  switchChainAsync,
  updateLifecycleStatus,
  useAggregator,
  walletCapabilities,
}: ProcessSwapTransactionParams) {
  const { transaction, approveTransaction, quote } = swapTransaction;
  const transactions: SwapTransaction[] = [];

  // for swaps from ERC-20 tokens,
  // if there is an approveTransaction present,
  // request approval for the amount
  // for V1 API, `approveTx` will be an ERC-20 approval against the Router
  // for V2 API, `approveTx` will be an ERC-20 approval against the `Permit2` contract
  if (approveTransaction?.data) {
    transactions.push({
      transaction: {
        to: approveTransaction.to,
        value: approveTransaction.value,
        data: approveTransaction.data,
      },
      transactionType: 'ERC20',
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
        transaction: {
          to: PERMIT2_CONTRACT_ADDRESS,
          value: 0n,
          data,
        },
        transactionType: 'Permit2',
      });
    }
  }
  // The Swap Execution Transaction
  transactions.push({
    transaction: {
      to: transaction.to,
      value: transaction.value,
      data: transaction.data,
    },
    transactionType: 'Swap',
  });

  // Switch to Base if the wallet is not on the current chain
  if (chainId !== base.id) {
    await switchChainAsync({ chainId: base.id });
  }

  await sendSwapTransactions({
    config,
    isSponsored,
    paymaster,
    sendCallsAsync,
    sendTransactionAsync,
    transactions,
    updateLifecycleStatus,
    walletCapabilities,
  });
}
