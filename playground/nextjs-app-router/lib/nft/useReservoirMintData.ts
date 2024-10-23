import type { ContractType } from '@/onchainkit/esm/nft/types';
import { useMemo } from 'react';
import { useToken } from './useToken';
import { useCollection } from './useCollection';
import { useOwners } from './useOwners';

export function useReservoirMintData(
  contractAddress: string,
  tokenId?: string,
) {
  const { data: collection } = useCollection(contractAddress, tokenId);

  const { data: owners } = useOwners(contractAddress, tokenId);

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

  const contractType = token?.kind?.toUpperCase() as ContractType;

  // ERC1155 each token is mintable, ERC721 you mint the collection
  return {
    name: contractType === 'ERC721' ? collection?.name : token?.name,
    description: collection?.description,
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
    contractType,
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
