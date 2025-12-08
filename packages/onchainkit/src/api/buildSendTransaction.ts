import { encodeFunctionData, erc20Abi } from 'viem';
import type {
  BuildSendTransactionParams,
  BuildSendTransactionResponse,
} from './types';
import { ApiErrorCode } from './constants';
import { buildErrorStruct } from './utils/buildErrorStruct';

export function buildSendTransaction({
  recipientAddress,
  tokenAddress,
  amount,
}: BuildSendTransactionParams): BuildSendTransactionResponse {
  // if no token address, we are sending native ETH
  // and the data prop is empty
  if (!tokenAddress) {
    return {
      to: recipientAddress,
      data: '0x',
      value: amount,
    };
  }

  try {
    const transferCallData = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipientAddress, amount],
    });
    return {
      to: tokenAddress,
      data: transferCallData,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return buildErrorStruct({
      code: ApiErrorCode.AmBSeTx01,
      error: message,
      message: 'Could not build transfer transaction',
    });
  }
}
