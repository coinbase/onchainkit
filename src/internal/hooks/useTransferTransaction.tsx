import { buildTransferTransaction } from '@/api/buildTransferTransaction';
import type { Token } from '@/token';
import type { Call } from '@/transaction/types';
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
}: UseTransferTransactionParams): { calls: Call[] } {
  if (!token) {
    return { calls: [] };
  }

  if (!token.address) {
    if (token.symbol !== 'ETH') {
      return { calls: [] };
    }
    const parsedAmount = parseUnits(amount, token.decimals);
    return {
      calls: buildTransferTransaction({
        recipientAddress,
        tokenAddress: null,
        amount: parsedAmount,
      }),
    };
  }

  const parsedAmount = parseUnits(amount.toString(), token.decimals);

  return {
    calls: buildTransferTransaction({
      recipientAddress,
      tokenAddress: token.address,
      amount: parsedAmount,
    }),
  };
}
