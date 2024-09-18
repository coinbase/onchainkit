import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { type Chain, mainnet } from 'viem/chains';


export type CachedMediaType = {
  originalUrl?: string;
  cachedPath?: string;
  mimeType?: string;
  itemSizeBytes?: string;
};

export type RecentCollectibleMedia = {
  image?: CachedMediaType;
  animation?: CachedMediaType;
};

export type CollectibleAttribute = {
  attributeName: string | undefined;
  attributeValue: string | undefined;
};

export type AudioMetadata = {
  artistName?: string;
  songName?: string;
};

export type PendingCollectibleDetails = {
  contractAddress: string;
  name?: string;
  tokenType?: string;
  tokenId: string;
  media?: RecentCollectibleMedia;
  description?: string;
  blockchainExplorerUrl?: CollectibleLink;
  marketplaceUrls?: CollectibleLink[];
  collectionName?: string;
  ownerAddress?: string;
  chainId?: string;
};

export type CollectibleLink = {
  iconUrl?: string;
  name: string;
  url: string;
};


export type Collectible = {
  id: string;
  contractAddress: string;
  collectionName: string;
  collectionSymbol: string;
  tokenId: string;
  tokenType: string;
  name: string | undefined;
  description: string | undefined;
  externalUrl: string | undefined;
  imageUrl: string | undefined;
  cachedImageUrl?: CachedMediaType;
  animationUrl: string | undefined;
  cachedAnimationUrl?: CachedMediaType;
  youtubeUrl: string | undefined;
  iframeUrl: string | undefined;
  attributes: CollectibleAttribute[] | undefined;
  openseaLink: string | undefined;
  raribleLink?: string;
  coinbaseLink?: string;
  paymentCurrency: string;
  lastSoldPrice?: string;
  tokenCount: string;
  ownerCount: string;
  floorPrice?: string;
  estimatedTokenValue?: string;
  ownerAddress?: string;
  spam?: boolean;
  audioNftMetadata?: AudioMetadata;
  ownedByWallet?: boolean;
  isPending?: boolean;
  pendingTokenDetails?: PendingCollectibleDetails;
  hasUnretrievableMetadata?: boolean;
  blockchainExplorerUrl?: CollectibleLink;
  marketplaceUrls?: CollectibleLink[];
};

type UseTokenDetails = {
  contractAddress?: string;
  tokenId?: string;
  chain?: Chain;
  includeFloorPrice?: boolean;
  userAddress?: string;
};

type UseQueryOptions = {
  enabled?: boolean;
  cacheTime?: number;
};

export function useTokenDetails({
  contractAddress,
  tokenId,
  chain = mainnet,
  includeFloorPrice,
  userAddress,
}: UseTokenDetails, queryOptions?: UseQueryOptions): UseQueryResult<Collectible> {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const actionKey = `useTokenDetails-${contractAddress}-${tokenId}-${chain.id}`;
  return useQuery({
    queryKey: ['useTokenDetails', actionKey],
    queryFn: async () => {
      return getTokenDetails(contractAddress, tokenId, includeFloorPrice, chain.id.toString(), userAddress);
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
}

type TokenDetailsParams = {
  contractAddress?: string;
  tokenId?: string;
  includeFloorPrice: string;
  chainId?: string;
  userAddress?: string;
};

export async function getTokenDetails(
  contractAddress?: string,
  tokenId?: string,
  includeFloorPrice = false,
  chainId?: string,
  userAddress?: string,
): Promise<Collectible | null> {
  if (!contractAddress || !tokenId || !chainId) {
    return null;
  }

  const params: TokenDetailsParams = {
    contractAddress,
    tokenId,
    chainId,
    includeFloorPrice: includeFloorPrice ? 'true' : 'false',
    ...(userAddress ? { userAddress } : {}),
  };

  const url = new URL('https://api.wallet.coinbase.com/rpc/v3/collectibles/getTokenDetails');
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url.toString(), {
    headers: { 
      'accept': '*/*',
    },
  });

  const data = await response.json();
  return data;
}

/*
__cf_bm=qTAQT_t9TmkyYIcoD5nHl0NhCYFgsj6DQR6ByIQ.60Y-1727453545-1.0.1.1-Gfh0NcDiM7aDAUXXFq2XJOYWLXFONeUMTGCrk5J3eRnevo4gGPxUyUpe4jg9VoPLpZp5j3aEbDb3.TmzEKxfcg; path=/; 
expires=Fri, 27-Sep-24 16:42:25 GMT; 
domain=.wallet.coinbase.com; 
HttpOnly; 
Secure; 
SameSite=None
*/

/*
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-site' \
*/