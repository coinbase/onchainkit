import type { UseNftMintDataProps } from '@/onchainkit/esm/nft/types';
import type { definitions } from '@reservoir0x/reservoir-sdk';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ENVIRONMENT_VARIABLES } from './constants';

type NonNullable<T> = T & {};
type Collection = NonNullable<
  definitions['getCollectionsV7Response']['collections']
>[0];

function useCollection(contractAddress: string) {
  return useQuery({
    queryKey: ['collection', contractAddress],
    queryFn: async () => {
      const response = await fetch(
        `https://api-base.reservoir.tools/collections/v7?id=${contractAddress}&includeMintStages=true`,
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

function useOwners(contractAddress: string) {
  return useQuery({
    queryKey: ['owners', contractAddress],
    queryFn: async () => {
      const response = await fetch(
        `https://api-base.reservoir.tools/owners/v2?contract=${contractAddress}&limit=2`,
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

export function useReservoirMintData({
  contractAddress,
  tokenId,
}: UseNftMintDataProps) {
  const { data: collection } = useCollection(contractAddress) as {
    data: Collection;
  };

  const { data: owners } = useOwners(contractAddress) as {
    data: definitions['getOwnersV2Response'];
  };

  const stage = useMemo(() => {
    const nowInSeconds = new Date().getTime() / 1000;
    return collection?.mintStages?.find(
      (stage) =>
        stage.tokenId === tokenId ||
        (typeof stage.endTime === 'undefined' &&
          stage.stage === 'public-sale') ||
        (stage.endTime &&
          Number(stage.endTime) > nowInSeconds &&
          stage.stage === 'public-sale'),
    );
  }, [collection, tokenId]);

  return {
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
