import { getPortfolioTokenBalances } from '@/core/api/getPortfolioTokenBalances';
import type { PortfolioTokenBalances } from '@/core/api/types';
import { isApiError } from '@/core/utils/isApiResponseError';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

export function usePortfolioTokenBalances({
  address,
}: {
  address: Address | undefined | null;
}): UseQueryResult<PortfolioTokenBalances> {
  const actionKey = `usePortfolioTokenBalances-${address}`;
  return useQuery({
    queryKey: ['usePortfolioTokenBalances', actionKey],
    queryFn: async () => {
      const response = await getPortfolioTokenBalances({
        addresses: [address as Address], // Safe to coerce to Address because useQuery's enabled flag will prevent the query from running if address is undefined
      });

      if (isApiError(response)) {
        throw new Error(response.message);
      }

      if (response.portfolios.length === 0) {
        return {
          address: address,
          portfolioBalanceUsd: 0,
          tokenBalances: [],
        };
      }

      return response.portfolios[0];
    },
    retry: false,
    enabled: !!address,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // refresh on mount every 5 minutes
    refetchOnMount: true,
    refetchInterval: 1000 * 60 * 15, // refresh in background every 15 minutes
    refetchIntervalInBackground: true,
  });
}
