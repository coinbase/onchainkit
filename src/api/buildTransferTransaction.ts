import type { Call } from '@/transaction/types';
import { type Address, encodeFunctionData, erc20Abi } from 'viem';

type BuildTransferTransactionParams = {
  recipientAddress: Address;
  tokenAddress: Address | null;
  amount: bigint;
};

export function buildTransferTransaction({
  recipientAddress,
  tokenAddress,
  amount,
}: BuildTransferTransactionParams): Call[] {
  // if no token address, we are sending native ETH
  // and the data prop is empty
  if (!tokenAddress) {
    return [
      {
        to: recipientAddress,
        data: '0x',
        value: amount,
      },
    ];
  }

  const transferCallData = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'transfer',
    args: [recipientAddress, amount],
  });

  return [
    {
      to: tokenAddress,
      data: transferCallData,
    },
  ];
}
