import { useQuery, type UseQueryResult } from '@tanstack/react-query';

enum ContractKind {
  CONTRACTKINDERC721 = 'ContractKindERC721',
  CONTRACTKINDERC1155 = 'ContractKindERC1155',
}

export type Amount = {
  decimal?: number;
  native?: number;
  raw?: string;
  usd?: number;
};

export type Currency = {
  contract?: string;
  decimals?: string;
  name?: string;
  symbol?: string;
};

export type Price = {
  amount?: Amount;
  currency?: Currency;
};

export type PricePerQuantity = {
  price?: Price;
  quantity?: string;
};

export type MintTokenDetails = {
  description?: string;
  name?: string;
  tokenId?: string;
};

export type MintStage = {
  endTime?: string;
  kind?: string;
  maxMintsPerWallet?: string;
  price?: Price;
  pricePerQuantity?: PricePerQuantity[];
  stage?: string;
  standard?: string;
  startTime?: string;
  tokenId?: string;
};

export type MintCollection = {
  address?: string;
  animationUrl?: string;
  creatorAddress?: string;
  description?: string;
  galleryId?: string;
  imageUrl?: string;
  isMinting?: boolean;
  kind?: ContractKind;
  maxSupply?: string;
  mintCount?: string;
  name?: string;
  network?: string;
  stages?: MintStage[];
  tokenDetails?: MintTokenDetails;
  tokenforgeMint?: boolean;
  tokenforgeMintActive?: boolean;
  tokenforgeMintExists?: boolean;
};

export type TakerEligibility = {
  address?: string;
  eligibleForCollection?: boolean;
  eligibleForTokens?: string[];
};

export type GetTrendingMintCollectionResponse = {
  collection?: MintCollection;
  mintFee?: Amount;
  takerEligibility?: TakerEligibility;
};


type UseQueryOptions = {
  enabled?: boolean;
  cacheTime?: number;
};

type UseTrendingMint = {
  address: string;
  takerAddress?: string;
  network?: string;
};

export function useTrendingMint({
  address,
  takerAddress,
  network,
}: UseTrendingMint, queryOptions?: UseQueryOptions): UseQueryResult<GetTrendingMintCollectionResponse> {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const actionKey = `useTrendingMint-${address}-${network}`;
  return useQuery({
    queryKey: ['useTokenDetails', actionKey],
    queryFn: async () => {
      return getTrendingMint(address, takerAddress, network);
    },
    gcTime: cacheTime,
    enabled: enabled && Boolean(address && takerAddress),
    refetchOnWindowFocus: false,
  });
}

export type TrendingMintCollectionParams = {
  network?: string;
  address?: string;
  tokenId?: string;
  takerAddress?: string;
  quantity?: string;
};

export async function getTrendingMint(
  address: string,
  takerAddress?: string,
  network?: string,
): Promise<MintCollection | null> {
  if (!address) {
    return null;
  }

  const params: TrendingMintCollectionParams = {
    address,
    takerAddress,
    network,
  };

  const url = new URL('https://api.wallet.coinbase.com/rpc/v3/creators/trendingMint');
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url.toString(), {
    headers: { 
      'accept': '*/*',
    },
  });

  const data = await response.json();
  return data;
}
//curl 'https://api.wallet.coinbase.com/rpc/v3/creators/trendingMint?network=networks%2Fbase-mainnet&address=0x3c8fec282501827b560f95d848536f211fbdd7ec&takerAddress=0xbB68Fc6d7469899dC8eb79Ad2895B16Ec36dF5Fe'
