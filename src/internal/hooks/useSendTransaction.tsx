import { buildSendTransaction } from '@/api/buildSendTransaction';
import type { BuildSendTransactionResponse } from '@/api/types';
import type { Token } from '@/token';
import { type Address, parseUnits } from 'viem';

type UseSendTransactionParams = {
  recipientAddress: Address;
  token: Token | null;
  amount: string;
};

export function useSendTransaction({
  recipientAddress,
  token,
  amount,
}: UseSendTransactionParams): BuildSendTransactionResponse {
  if (!token) {
    return {
      code: 'AmBSeTx01', // Api Module Build Send Transaction Error 01
      error: 'No token provided',
      message: 'Could not build send transaction',
    };
  }

  if (!token.address) {
    if (token.symbol !== 'ETH') {
      return {
        code: 'AmBSeTx02', // Api Module Build Send Transaction Error 02
        error: 'No token address provided for non-ETH token',
        message: 'Could not build send transaction',
      };
    }
    const parsedAmount = parseUnits(amount, token.decimals);
    const sendTransaction = buildSendTransaction({
      recipientAddress,
      tokenAddress: null,
      amount: parsedAmount,
    });
    return sendTransaction;
  }

  const parsedAmount = parseUnits(amount, token.decimals);
  const sendTransaction = buildSendTransaction({
    recipientAddress,
    tokenAddress: token.address,
    amount: parsedAmount,
  });

  return sendTransaction;
}
