import { encodeFunctionData } from 'viem';
import type { Call, SendSingleTransactionParams } from '../types';
import { isContract } from './isContract';

export const sendSingleTransactions = async ({
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
    await sendCallAsync(call as Call);
  }
};
