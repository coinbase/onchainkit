import {
  type GetPortfolioTokenBalancesParams,
  type Portfolio,
  getPortfolioTokenBalances,
} from '@/core/api/getPortfolioTokenBalances';
import { isApiError } from '@/core/utils/isApiResponseError';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

export function usePortfolioTokenBalances({
  addresses,
}: GetPortfolioTokenBalancesParams): UseQueryResult<Portfolio[]> {
  const actionKey = `usePortfolioTokenBalances-${addresses}`;
  return useQuery({
    queryKey: ['usePortfolioTokenBalances', actionKey],
    queryFn: async () => {
      const response = await getPortfolioTokenBalances({
        addresses,
      });

      if (isApiError(response)) {
        throw new Error(response.message);
      }

      return response.tokens;
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!addresses && addresses.length > 0,
    refetchInterval: 1000 * 60 * 15, // 15 minutes
  });
}
