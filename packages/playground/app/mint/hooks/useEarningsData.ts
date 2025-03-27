import { useCollection } from '@/lib/nft/useCollection';
import { useToken } from '@/lib/nft/useToken';
import type { ContractType } from '@/onchainkit/esm/nft/types';
import { useMemo } from 'react';

export function useEarningsData(contractAddress: string, tokenId?: string) {
  const { data: collection } = useCollection(contractAddress);

  const { data: token } = useToken(contractAddress, tokenId);

  const stage = useMemo(() => {
    const nowInSeconds = new Date().getTime() / 1000;
    return token?.mintStages?.find(
      (stage) =>
        stage.tokenId === tokenId ||
        ((stage.endTime === null || typeof stage.endTime === 'undefined') &&
          stage.stage === 'public-sale') ||
        (stage.endTime &&
          Number(stage.endTime) > nowInSeconds &&
          stage.stage === 'public-sale'),
    );
  }, [token, tokenId]);

  const mintDate = useMemo(() => {
    if (!token?.mintedAt) {
      return undefined;
    }

    if (new Date(token.mintedAt).getTime() === 0) {
      return undefined;
    }

    return new Date(token.mintedAt);
  }, [token?.mintedAt]);

  const hasMintingStarted = useMemo(() => {
    if (!stage?.startTime) {
      return false;
    }

    // if startTime is in the past, minting has started
    return stage.startTime < new Date().getTime() / 1000;
  }, [stage]);

  const hasMintingEnded = useMemo(() => {
    if (!stage?.endTime) {
      return false;
    }

    // if endTime is in the past, minting has ended
    return stage.endTime < new Date().getTime() / 1000;
  }, [stage]);

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
    mintDate,
    price: {
      amount: stage?.price?.amount?.decimal,
      currency: stage?.price?.currency?.symbol,
      amountUSD: stage?.price?.amount?.usd,
    },
    gasFee: null,
    creatorAddress: collection?.creator as `0x${string}`,
    maxMintsPerWallet: stage?.maxMintsPerWallet,
    isEligibleToMint:
      collection?.isMinting && hasMintingStarted && !hasMintingEnded,
    totalOwners: collection?.ownerCount,
  };
}
