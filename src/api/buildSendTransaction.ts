import { encodeFunctionData, erc20Abi } from 'viem';
import type {
  BuildSendTransactionParams,
  BuildSendTransactionResponse,
} from './types';

export function buildSendTransaction({
  recipientAddress,
  tokenAddress,
  amount,
}: BuildSendTransactionParams): BuildSendTransactionResponse {
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

  try {
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
  } catch (error) {
    return {
      code: 'AmBSeTa01', // Api Module Build Send Transaction Error 01
      error: `Something went wrong: ${error}`,
      message: 'Could not build transfer transaction',
    };
  }
}
