import type { paths } from '@reservoir0x/reservoir-sdk'
import type { NftDataType } from '../types';
import { type Chain, mainnet } from 'viem/chains';
import { useQuery } from '@tanstack/react-query';

type UseTokens = {
  tokens: `0x${string}:${number}`[];
  chain: Chain;
};

type UseQueryOptions = {
  enabled?: boolean;
  cacheTime?: number;
};

type UseTokensReturnType = paths['/tokens/v7']['get']['responses']['200']['schema'];

export const useTokens = (
  { tokens, chain = mainnet }: UseTokens,
  queryOptions?: UseQueryOptions,
) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const tokenString = tokens.map(t => `tokens=${encodeURIComponent(t)}`).join('&');
  const actionKey = `useTokens-${tokenString}-${chain.id}`;
  return useQuery<NftDataType>({
    queryKey: ['useTokens', actionKey],
    queryFn: async () => {
      return await getTokens({ tokens: tokenString, chain });
    },
    gcTime: cacheTime,
    enabled: Boolean(tokens) && enabled,
    refetchOnWindowFocus: false,
  });
};

type GetTokens = {
  tokens: string;
  chain?: Chain;
};

export const getTokens = async ({
  tokens,
  chain = mainnet,
}: GetTokens): Promise<NftDataType> => {
  const response = await fetch(`https://api-${chain.name}.reservoir.tools/tokens/v7?${tokens}&includeLastSale=true`, {
    method: 'GET', 
    headers: { accept: '*/*', 'x-api-key': '2ed8a259-98e9-514f-99a4-19e7b11b4fca' }
  });
  const data = await response.json() as UseTokensReturnType;
  return data.tokens?.[0].token;
};

