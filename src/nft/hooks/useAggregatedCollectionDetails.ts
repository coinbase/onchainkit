import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { UseQueryOptions } from '../types';
import { GET_AGGREGATED_COLLECTION_DETAILS_URI } from '../constants';

type UseAggregatedCollectionDetailsOptions = {
  contractAddress: string;
  chainId: number;
};

type TokenOwnerInfo = {
  name: string;
  description: string;
  image: string;
  mimeType: string;
  contractType: string;
  totalTokens: string;
  totalOwners: string;
  creatorAddress: `0x${string}`;
};

export function useAggregatedCollectionDetails(
  { contractAddress, chainId }: UseAggregatedCollectionDetailsOptions,
  queryOptions?: UseQueryOptions,
): UseQueryResult<TokenOwnerInfo> {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const actionKey = `useAggregatedCollectionDetails-${contractAddress}-${chainId}`;
  return useQuery({
    queryKey: ['useAggregatedCollectionDetails', actionKey],
    queryFn: async () => {
      return getAggregatedCollectionDetails({
        contractAddress,
        chainId,
      });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
}

type GetAggregatedCollectionDetails = {
  contractAddress: string;
  chainId: number;
};

type GetAggregatedCollectionParams = {
  contractAddress: string;
  chainId: string;
};

export async function getAggregatedCollectionDetails({
  contractAddress,
  chainId,
}: GetAggregatedCollectionDetails): Promise<TokenOwnerInfo | null> {
  const params: GetAggregatedCollectionParams = {
    contractAddress,
    chainId: chainId.toString(),
  };

  const url = new URL(GET_AGGREGATED_COLLECTION_DETAILS_URI);
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return {
    name: data?.result.collectionName,
    description: data?.result.collectionDescription,
    image:
      data?.result.collectionImage ??
      data?.result.cachedCollectionImage.originalUrl,
    mimeType: data?.result.cachedCollectionImage.mimeType,
    contractType: data?.result.contractType,
    totalTokens: data?.result.totalTokens,
    totalOwners: data?.result.ownerCount,
    creatorAddress: data?.result.creatorAddress,
  };
}
