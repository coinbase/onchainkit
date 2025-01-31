import { getSwapQuote } from '@/api';
import { RequestContext } from '@/core/network/constants';
import { isApiError } from '@/internal/utils/isApiResponseError';
import type { Token } from '@/token';
import { usdcToken } from '@/token/constants';
import type { Dispatch, SetStateAction } from 'react';

type UseExchangeRateParams = {
  token: Token;
  selectedInputType: 'crypto' | 'fiat';
  setExchangeRate: Dispatch<SetStateAction<number>>;
  setExchangeRateLoading?: Dispatch<SetStateAction<boolean>>;
};

export async function useExchangeRate({
  token,
  selectedInputType,
  setExchangeRate,
  setExchangeRateLoading,
}: UseExchangeRateParams) {
  if (!token) {
    return;
  }

  if (token.address === usdcToken.address) {
    setExchangeRate(1);
    return;
  }

  setExchangeRateLoading?.(true);

  const fromToken = selectedInputType === 'crypto' ? token : usdcToken;
  const toToken = selectedInputType === 'crypto' ? usdcToken : token;

  try {
    const response = await getSwapQuote(
      {
        amount: '1', // hardcoded amount of 1 because we only need the exchange rate
        from: fromToken,
        to: toToken,
        useAggregator: false,
      },
      RequestContext.Wallet,
    );
    if (isApiError(response)) {
      console.error('Error fetching exchange rate:', response.error);
      return;
    }
    const rate =
      selectedInputType === 'crypto'
        ? 1 / Number(response.fromAmountUSD)
        : Number(response.toAmount) / 10 ** response.to.decimals;
    setExchangeRate(rate);
  } catch (error) {
    console.error('Uncaught error fetching exchange rate:', error);
  } finally {
    setExchangeRateLoading?.(false);
  }
}
