import { buildSendTransaction } from '@/api/buildSendTransaction';
import type { BuildSendTransactionResponse } from '@/api/types';
import type { Token } from '@/token';
import { type Address, parseUnits } from 'viem';

type UseTransferTransactionParams = {
  recipientAddress: Address;
  token: Token | null;
  amount: string;
};

export function useTransferTransaction({
  recipientAddress,
  token,
  amount,
}: UseTransferTransactionParams): { calls: BuildSendTransactionResponse } {
  if (!token) {
    return { calls: [] };
  }

  if (!token.address) {
    if (token.symbol !== 'ETH') {
      return { calls: [] };
    }
    const parsedAmount = parseUnits(amount, token.decimals);
    return {
      calls: buildSendTransaction({
        recipientAddress,
        tokenAddress: null,
        amount: parsedAmount,
      }),
    };
  }

  const parsedAmount = parseUnits(amount.toString(), token.decimals);

  return {
    calls: buildSendTransaction({
      recipientAddress,
      tokenAddress: token.address,
      amount: parsedAmount,
    }),
  };
}
