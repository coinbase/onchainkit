import { type Chain, mainnet } from 'viem/chains';
import type { UseQueryOptions } from '../types';
import { useQuery } from '@tanstack/react-query';
import { getMintDate } from '../utils/getMintDate';

type UseMintDateOptions = {
  contractAddress: `0x${string}`;
  tokenId?: string;
  chain?: Chain;
};

export const useMintDate = (
  { contractAddress, tokenId, chain = mainnet }: UseMintDateOptions,
  queryOptions?: UseQueryOptions,
) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const actionKey = `useMintDate-${contractAddress}-${tokenId}-${chain.id}`;
  return useQuery<Date | null>({
    queryKey: ['useMintDate', actionKey],
    queryFn: async () => {
      return await getMintDate({ contractAddress, tokenId, chain });
    },
    gcTime: cacheTime,
    enabled: enabled && Boolean(contractAddress && tokenId),
    refetchOnWindowFocus: false,
  });
};
