import { getPortfolios } from '@/api/getPortfolios';
import type { Portfolio } from '@/api/types';
import { isApiError } from '@/internal/utils/isApiResponseError';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

/**
 * Retrieves the portfolio for the provided address
 * portfolio includes the address, the balance of the address in USD, and the tokens in the address
 */
export function usePortfolio({
  address,
}: {
  address: Address | undefined | null;
}): UseQueryResult<Portfolio> {
  return useQuery({
    queryKey: ['usePortfolio', address],
    queryFn: async () => {
      const response = await getPortfolios({
        addresses: [address as Address], // Safe to coerce to Address because useQuery's enabled flag will prevent the query from running if address is undefined
      });

      if (isApiError(response)) {
        throw new Error(response.message);
      }

      if (response.portfolios.length === 0) {
        return {
          address,
          portfolioBalanceUsd: 0,
          tokenBalances: [],
        };
      }

      return response.portfolios[0];
    },
    retry: false,
    enabled: !!address,
    refetchOnWindowFocus: true, // refresh on window focus
    staleTime: 1000 * 60 * 5, // refresh on mount every 5 minutes
    refetchOnMount: true,
    refetchInterval: 1000 * 60 * 15, // refresh in background every 15 minutes
    refetchIntervalInBackground: true,
  });
}
