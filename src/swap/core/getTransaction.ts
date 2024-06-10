import { Transaction, RawTransactionData } from '../types';

/**
 * Constructs an unsigned transaction.
 */
export function getTransaction(tx: RawTransactionData, chainId: string): Transaction {
  const { data, gas, to, value } = tx;

  const txData = {
    chainId: Number(chainId),
    data: data as `0x${string}`,
    gas: BigInt(gas),
    to: to as `0x${string}`,
    value: BigInt(value),
  };

  return {
    transaction: txData,
    withParams(params) {
      const { nonce, maxFeePerGas, maxPriorityFeePerGas } = params;

      return {
        ...txData,
        nonce,
        maxFeePerGas,
        maxPriorityFeePerGas,
      };
    },
  };
}
