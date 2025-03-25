import { buildSendTransaction } from '@/api/buildSendTransaction';
import type { APIError } from '@/api/types';
import { isApiError } from '@/internal/utils/isApiResponseError';
import type { Token } from '@/token';
import type { Call } from '@/transaction/types';
import { type Address, parseUnits } from 'viem';

type GetSendCalldataParams = {
  recipientAddress: Address | null;
  token: Token | null;
  amount: string | null;
};

type GetSendCalldataResponse = {
  calldata: Call | null;
  error: APIError | null;
};

export function getSendCalldata({
  recipientAddress,
  token,
  amount,
}: GetSendCalldataParams): GetSendCalldataResponse {
  if (!recipientAddress || !token || !token.decimals || !amount) {
    return {
      calldata: null,
      error: {
        code: 'SemBSeTx01',
        error: 'Invalid transaction parameters',
        message: 'Could not build send transaction',
      },
    };
  }

  if (!token.address && token.symbol !== 'ETH') {
    return {
      calldata: null,
      error: {
        code: 'SemBSeTx02',
        error: 'No token address provided for non-ETH token',
        message: 'Could not build send transaction',
      },
    };
  }

  try {
    const parsedAmount = parseUnits(amount, token.decimals);
    const sendTransaction = buildSendTransaction({
      recipientAddress,
      tokenAddress: token.address || null,
      amount: parsedAmount,
    });

    if (isApiError(sendTransaction)) {
      return {
        calldata: null,
        error: sendTransaction,
      };
    }

    return {
      calldata: sendTransaction,
      error: null,
    };
  } catch (err) {
    return {
      calldata: null,
      error: {
        code: 'SemBSeTx03',
        error: err instanceof Error ? err.message : 'Unknown error',
        message: 'Could not build send transaction',
      },
    };
  }
}
