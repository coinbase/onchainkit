import { getPortfolioTokenBalances } from '@/core/api/getPortfolioTokenBalances';
import type {
  GetPortfolioTokenBalancesParams,
  PortfolioTokenBalanceAPIResponse,
  PortfolioTokenBalances,
  PortfolioTokenWithFiatValue,
} from '@/core/api/types';
import { isApiError } from '@/core/utils/isApiResponseError';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

export function usePortfolioTokenBalances({
  addresses,
}: GetPortfolioTokenBalancesParams): UseQueryResult<PortfolioTokenBalances> {
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

      const userPortfolio = response.tokens[0];

      const transformedPortfolio: PortfolioTokenBalances = {
        address: userPortfolio.address,
        portfolioBalanceUsd: userPortfolio.portfolio_balance_usd,
        tokenBalances: userPortfolio.token_balances.map(
          (tokenBalance: PortfolioTokenBalanceAPIResponse) => ({
            address:
              tokenBalance.symbol === 'ETH' ? '' : tokenBalance.address,
            chainId: tokenBalance.chain_id,
            decimals: tokenBalance.decimals,
            image: tokenBalance.image,
            name: tokenBalance.name,
            symbol: tokenBalance.symbol,
            cryptoBalance: tokenBalance.crypto_balance,
            fiatBalance: tokenBalance.fiat_balance,
          }) as PortfolioTokenWithFiatValue,
        ),
      };

      const filteredPortfolio = {
        ...transformedPortfolio,
        tokenBalances: transformedPortfolio.tokenBalances.filter(
          (tokenBalance: PortfolioTokenWithFiatValue) =>
            tokenBalance.cryptoBalance > 0,
        ),
      };

      return filteredPortfolio;
    },
    retry: false,
    enabled: !!addresses && addresses.length > 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // refresh on mount every 5 minutes
    refetchOnMount: true,
    refetchInterval: 1000 * 60 * 15, // refresh in background every 15 minutes
    refetchIntervalInBackground: true,
  });
}
