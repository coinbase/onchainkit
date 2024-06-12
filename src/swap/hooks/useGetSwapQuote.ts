import { useCallback, useEffect } from 'react';
import { Token } from '../../token';
import { getSwapQuote } from '../core/getSwapQuote';
import { SwapError } from '../types';
import { isSwapError } from '../utils';

type UseGetSwapQuoteParams = {
  amountReference?: 'to' | 'from';
  fromAmount?: string;
  fromToken?: Token;
  onError?: (error: SwapError) => void;
  onSuccess?: () => void;
  setToAmount: (amount: string) => void;
  setFromAmount: (amount: string) => void;
  toAmount?: string;
  toToken?: Token;
};

async function useGetSwapQuote({
  amountReference,
  fromAmount,
  fromToken,
  onError,
  onSuccess,
  setToAmount,
  setFromAmount,
  toAmount,
  toToken,
}: UseGetSwapQuoteParams) {
  const handleGetSwapQuote = useCallback(
    /* the reference amount for the swap */
    async (amountReference: 'to' | 'from') => {
      const amount = amountReference === 'from' ? fromAmount : toAmount;
      if (fromToken && toToken && amount && amountReference) {
        try {
          const response = await getSwapQuote({
            from: fromToken,
            to: toToken,
            amount,
            amountReference,
          });
          if (isSwapError(response)) {
            onError?.(response);
          } else {
            if (amountReference === 'from') {
              setToAmount(response?.toAmount);
            }
            if (amountReference === 'to') {
              setFromAmount(response?.fromAmount);
            }
            onSuccess?.();
          }
        } catch (error) {
          onError?.(error as SwapError);
        }
      }
    },
    [fromAmount, fromToken, onError, onSuccess, setFromAmount, setToAmount, toAmount, toToken],
  );

  useEffect(() => {
    /* we only want to fetch the swap quote for fromToken
    reference amount if the user last changed the fromAmount  */
    const fetchFromQuote = async () => {
      if (fromToken && toToken && fromAmount && amountReference === 'from') {
        await handleGetSwapQuote('from');
      }
    };
    fetchFromQuote();
  }, [fromAmount, fromToken, handleGetSwapQuote, amountReference, toToken]);

  useEffect(() => {
    /* we only want to fetch the swap quote for toToken
    reference amount if the user last changed the toAmount  */
    const fetchToQuote = async () => {
      if (fromToken && toToken && toAmount && amountReference === 'to') {
        handleGetSwapQuote('to');
      }
    };
    fetchToQuote();
  }, [fromToken, handleGetSwapQuote, amountReference, toAmount, toToken]);
}

export { useGetSwapQuote };
