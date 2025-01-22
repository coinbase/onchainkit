import { getMintDetails } from '@/core/api/getMintDetails';
import type { MintDetails } from '@/core/api/types';
import { isNFTError } from '@/core/nft/utils/isNFTError';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { UseMintDetailsParams } from '../types';

export function useMintDetails({
  contractAddress,
  takerAddress,
  tokenId,
  queryOptions,
}: UseMintDetailsParams<MintDetails>): UseQueryResult<MintDetails> {
  return useQuery({
    queryKey: ['useMintDetails', contractAddress, takerAddress, tokenId],
    queryFn: async () => {
      const mintDetails = await getMintDetails({
        contractAddress,
        takerAddress,
        tokenId,
      });

      if (isNFTError(mintDetails)) {
        throw mintDetails;
      }

      return mintDetails;
    },
    retry: false,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
}
