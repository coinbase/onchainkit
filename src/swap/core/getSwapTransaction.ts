import type { Address, Hex } from 'viem';
import type {
  RawTransactionData,
  SwapTransaction,
  Transaction,
} from '../types';

/**
 * Constructs an unsigned transaction.
 *
 * A transaction is a message sent by an Account requesting
 * to perform an action on the Ethereum blockchain.
 *
 * Transactions can be used to transfer Ether between accounts,
 * execute smart contract code, deploy smart contracts, etc.
 */
export function getSwapTransaction(
  rawTx: RawTransactionData,
  chainId: string,
): SwapTransaction {
  const { data, gas, to, value } = rawTx;

  const tx: Transaction = {
    chainId: Number(chainId),
    data: data as Hex,
    gas: BigInt(gas),
    to: to as Address,
    value: BigInt(value),
  };

  return {
    transaction: tx,
    withParams(params) {
      const { nonce, maxFeePerGas, maxPriorityFeePerGas } = params;
      return {
        ...tx,
        nonce,
        maxFeePerGas,
        maxPriorityFeePerGas,
      };
    },
  };
}
