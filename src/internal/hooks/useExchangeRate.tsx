import { getPriceQuote } from '@/api';
import type { PriceQuoteToken } from '@/api/types';
import { RequestContext } from '@/core/network/constants';
import { isApiError } from '@/internal/utils/isApiResponseError';
import type { Dispatch, SetStateAction } from 'react';

type UseExchangeRateParams = {
  token: PriceQuoteToken;
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

  setExchangeRateLoading?.(true);

  try {
    const response = await getPriceQuote(
      { tokens: [token] },
      RequestContext.Wallet,
    );
    if (isApiError(response)) {
      console.error('Error fetching price quote:', response.error);
      return;
    }
    const priceQuote = response.priceQuotes[0];

    const rate =
      selectedInputType === 'crypto'
        ? 1 / Number(priceQuote.price)
        : Number(priceQuote.price);

    setExchangeRate(rate);
  } catch (error) {
    console.error('Uncaught error fetching price quote:', error);
  } finally {
    setExchangeRateLoading?.(false);
  }
}
