import { encodeFunctionData } from 'viem';
import { waitForTransactionReceipt } from 'wagmi/actions';
import type { SendSingleTransactionParams } from '../types';
import { isContract } from './isContract';

export const sendSingleTransactions = async ({
  config,
  sendCallAsync,
  transactions,
}: SendSingleTransactionParams) => {
  const calls = transactions?.map((transaction) => {
    if (isContract(transaction)) {
      return {
        data: encodeFunctionData({
          abi: transaction?.abi,
          functionName: transaction?.functionName,
          args: transaction?.args,
        }),
        to: transaction?.address,
      };
    }
    return transaction;
  });

  for (const call of calls) {
    const txHash = await sendCallAsync(call);
    if (txHash) {
      await waitForTransactionReceipt(config, {
        hash: txHash,
        confirmations: 1,
      });
    }
  }
};
