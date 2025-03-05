import { getPriceQuote } from '@/api';
import type { PriceQuoteToken } from '@/api/types';
import { RequestContext } from '@/core/network/constants';
import { isApiError } from '@/internal/utils/isApiResponseError';
import { useEffect, useState } from 'react';

type UseExchangeRateParams = {
  token: PriceQuoteToken | undefined | '';
  selectedInputType: 'crypto' | 'fiat';
};

type ExchangeRate = number | undefined;

export function useExchangeRate({
  token,
  selectedInputType,
}: UseExchangeRateParams) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setExchangeRate(undefined);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    getPriceQuote({ tokens: [token] }, RequestContext.Wallet)
      .then((response) => {
        if (isApiError(response)) {
          setError(response.error);
          setExchangeRate(undefined);
          console.error('Error fetching price quote:', response.error);
          return;
        }

        const priceQuote = response.priceQuote[0];
        const rate =
          selectedInputType === 'crypto'
            ? 1 / Number(priceQuote.price)
            : Number(priceQuote.price);

        setExchangeRate(rate);
        setError(null);
      })
      .catch((error) => {
        console.error('Uncaught error fetching price quote:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token, selectedInputType]);

  return {
    isLoading,
    exchangeRate,
    error,
  };
}
