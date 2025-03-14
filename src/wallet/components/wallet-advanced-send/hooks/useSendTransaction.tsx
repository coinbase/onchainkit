import { buildSendTransaction } from '@/api/buildSendTransaction';
import type { APIError } from '@/api/types';
import { isApiError } from '@/internal/utils/isApiResponseError';
import type { Token } from '@/token';
import type { Call } from '@/transaction/types';
import { useEffect, useState } from 'react';
import { type Address, parseUnits } from 'viem';

type UseSendTransactionParams = {
  recipientAddress: Address | null;
  token: Token | null;
  amount: string | null;
};

type UseSendTransactionResponse = {
  calldata: Call | null;
  error: APIError | null;
};

export function useSendTransaction({
  recipientAddress,
  token,
  amount,
}: UseSendTransactionParams): UseSendTransactionResponse {
  const [calldata, setCalldata] = useState<Call | null>(null);
  const [error, setError] = useState<APIError | null>(null);

  useEffect(() => {
    const { calldata, error } = getTransactionData(
      recipientAddress,
      token,
      amount,
    );
    setCalldata(calldata);
    setError(error);
  }, [recipientAddress, token, amount]);

  return { calldata, error };
}

function getTransactionData(
  recipientAddress: Address | null,
  token: Token | null,
  amount: string | null,
) {
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
