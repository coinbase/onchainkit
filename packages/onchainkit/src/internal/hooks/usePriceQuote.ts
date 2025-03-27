import { getPriceQuote } from '@/api';
import type { GetPriceQuoteResponse, PriceQuoteToken } from '@/api/types';
import { RequestContext } from '@/core/network/constants';
import { DEFAULT_QUERY_OPTIONS } from '@/internal/constants';
import { isApiError } from '@/internal/utils/isApiResponseError';
import {
  type UseQueryOptions,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

type UsePriceQuoteParams<T> = {
  token: PriceQuoteToken | undefined;
  queryOptions?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>;
};

export function usePriceQuote(
  params: UsePriceQuoteParams<GetPriceQuoteResponse>,
  _context: RequestContext = RequestContext.Hook,
): UseQueryResult<GetPriceQuoteResponse> {
  const { token, queryOptions } = params;

  return useQuery({
    queryKey: ['getPriceQuote', token],
    queryFn: async () => {
      if (!token) {
        return {
          priceQuotes: [],
        };
      }

      const response = await getPriceQuote({ tokens: [token] }, _context);

      if (isApiError(response)) {
        throw response;
      }

      return response;
    },
    ...DEFAULT_QUERY_OPTIONS,
    ...queryOptions,
  });
}
