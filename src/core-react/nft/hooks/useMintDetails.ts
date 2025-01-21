import { getMintDetails } from '@/api/getMintDetails';
import type { GetMintDetailsParams, MintDetails } from '@/api/types';
import { isNFTError } from '@/core/nft/utils/isNFTError';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';

export function useMintDetails({
  contractAddress,
  takerAddress,
  tokenId,
}: GetMintDetailsParams): UseQueryResult<MintDetails> {
  const actionKey = `useMintDetails-${contractAddress}-${takerAddress}-${tokenId}`;
  return useQuery({
    queryKey: ['useMintDetails', actionKey],
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
  });
}
