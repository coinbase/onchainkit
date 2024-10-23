import type { ContractType } from '@/onchainkit/esm/nft/types';
import type { definitions } from '@reservoir0x/reservoir-sdk';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ENVIRONMENT_VARIABLES } from './constants';

type NonNullable<T> = T & {};
type Collection = NonNullable<
  definitions['getCollectionsV7Response']['collections']
>[0];
type Token = NonNullable<
  NonNullable<definitions['getTokensV7Response']['tokens']>[0]
>['token'];

function useToken(contractAddress: string, tokenId?: string) {
  return useQuery({
    queryKey: ['token', contractAddress, tokenId],
    queryFn: async () => {
      const qs = tokenId
        ? `tokens=${contractAddress}:${tokenId}`
        : `collection=${contractAddress}`;
      const response = await fetch(
        `https://api-base.reservoir.tools/tokens/v7?${qs}&includeLastSale=true`,
        {
          method: 'GET',
          headers: {
            accept: '*/*',
            'x-api-key': ENVIRONMENT_VARIABLES.RESERVOIR_API_KEY ?? '',
          },
        },
      );
      const data = await response.json();
      // if no tokenId, get the collection and default to the first token
      return data.tokens[0].token as Token;
    },
  });
}

function useCollection(contractAddress: string, tokenId?: string) {
  const qs = tokenId
    ? `id=${contractAddress}:${tokenId}:${tokenId}`
    : `id=${contractAddress}`;
  return useQuery({
    queryKey: ['collection', contractAddress],
    queryFn: async () => {
      const response = await fetch(
        `https://api-base.reservoir.tools/collections/v7?${qs}&includeMintStages=true`,
        {
          method: 'GET',
          headers: {
            accept: '*/*',
            'x-api-key': ENVIRONMENT_VARIABLES.RESERVOIR_API_KEY ?? '',
          },
        },
      );
      const data = await response.json();
      return data.collections[0];
    },
  });
}

function useOwners(contractAddress: string, tokenId?: string) {
  const qs = tokenId
    ? `token=${contractAddress}:${tokenId}`
    : `collection=${contractAddress}`;
  return useQuery({
    queryKey: ['owners', contractAddress],
    queryFn: async () => {
      const response = await fetch(
        `https://api-base.reservoir.tools/owners/v2?${qs}&limit=2`,
        {
          method: 'GET',
          headers: {
            accept: '*/*',
            'x-api-key': ENVIRONMENT_VARIABLES.RESERVOIR_API_KEY ?? '',
          },
        },
      );
      const data = await response.json();
      return data;
    },
  });
}

export function useReservoirMintData(
  contractAddress: string,
  tokenId?: string,
) {
  const { data: collection } = useCollection(contractAddress, tokenId) as {
    data: Collection;
  };

  const { data: owners } = useOwners(contractAddress, tokenId) as {
    data: definitions['getOwnersV2Response'];
  };

  const { data: token } = useToken(contractAddress, tokenId);

  const stage = useMemo(() => {
    const nowInSeconds = new Date().getTime() / 1000;
    return collection?.mintStages?.find(
      (stage) =>
        stage.tokenId === tokenId ||
        ((stage.endTime === null || typeof stage.endTime === 'undefined') &&
          stage.stage === 'public-sale') ||
        (stage.endTime &&
          Number(stage.endTime) > nowInSeconds &&
          stage.stage === 'public-sale'),
    );
  }, [collection, tokenId]);

  return {
    name: token?.name,
    description: token?.description,
    imageUrl: token?.image,
    animationUrl: token?.media,
    mimeType: (token?.metadata?.mediaMimeType ??
      token?.metadata?.imageMimeType ??
      '') as string,
    ownerAddress: token?.owner as `0x${string}`,
    lastSoldPrice: {
      amount: token?.lastSale?.price?.amount?.decimal,
      currency: token?.lastSale?.price?.currency?.symbol,
      amountUSD: token?.lastSale?.price?.amount?.usd,
    },
    contractType: token?.kind?.toUpperCase() as ContractType,
    mintDate: token?.mintedAt ? new Date(token?.mintedAt) : undefined,
    price: {
      amount: stage?.price?.amount?.decimal,
      currency: stage?.price?.currency?.symbol,
      amountUSD: stage?.price?.amount?.usd,
    },
    mintFee: {
      amount: 0,
      currency: 'ETH',
      amountUSD: 0,
    },
    gasFee: null,
    creatorAddress: collection?.creator as `0x${string}`,
    maxMintsPerWallet: stage?.maxMintsPerWallet,
    isEligibleToMint: collection?.isMinting,
    totalOwners: collection?.ownerCount,
    recentOwners: owners?.owners?.map(
      (owner) => owner.address as `0x${string}`,
    ),
  };
}
