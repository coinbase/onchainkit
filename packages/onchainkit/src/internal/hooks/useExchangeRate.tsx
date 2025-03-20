import type { PriceQuoteToken } from '@/api/types';
import { RequestContext } from '@/core/network/constants';
import { usePriceQuote } from '@/internal/hooks/usePriceQuote';
import { isApiError } from '@/internal/utils/isApiResponseError';
import { useMemo } from 'react';

type UseExchangeRateParams = {
  token: PriceQuoteToken | undefined;
  selectedInputType: 'crypto' | 'fiat';
};

export function useExchangeRate(
  { token, selectedInputType }: UseExchangeRateParams,
  _context = RequestContext.Hook,
) {
  const { data, isLoading, error } = usePriceQuote(
    {
      token,
      queryOptions: {
        enabled: !!token,
      },
    },
    _context,
  );

  const exchangeRate = useMemo(() => {
    if (!data || isApiError(data) || data.priceQuotes.length === 0) {
      return 0;
    }

    const priceQuote = data.priceQuotes[0];

    if (selectedInputType === 'crypto') {
      return 1 / Number(priceQuote.price);
    }

    return Number(priceQuote.price);
  }, [data, selectedInputType]);

  return {
    isLoading,
    exchangeRate,
    error,
  };
}
