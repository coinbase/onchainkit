import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useMintToken } from './useMintToken';
import { useTrendingMint } from './useTrendingMint';
import { useAggregatedCollectionDetails } from './useAggregatedCollectionDetails';
import type { NftMintData, UseNftMintDataProps } from '../types';
import { useOnchainKit } from '../../useOnchainKit';
import { useRecentMints } from './useRecentMints';

export function useNftMintData({
  contractAddress,
  tokenId,
  contractType,
  quantity,
}: UseNftMintDataProps): NftMintData {
  const { chain } = useOnchainKit();
  const { address } = useAccount();

  const { data: trendingMint } = useTrendingMint({
    address: contractAddress,
    takerAddress: address,
  });

  const { data: tokenOwnerInfo } = useAggregatedCollectionDetails({
    contractAddress,
    chainId: chain.id,
  });

  const {
    data: mintToken,
    // isError,
    // error,
  } = useMintToken({
    mintAddress: contractAddress,
    takerAddress: address,
    network: trendingMint?.collection?.network,
    quantity: quantity.toString(),
    tokenId,
  });

  const recentMints = useRecentMints({
    contractAddress,
    count: 2,
    chain,
    tokenType: contractType,
  });

  const stage = useMemo(() => {
    const nowInSeconds = new Date().getTime() / 1000;
    return trendingMint?.collection?.stages?.find(
      (stage) =>
        stage.tokenId === tokenId ||
        (typeof stage.endTime === 'undefined' &&
          stage.stage === 'public-sale') ||
        (stage.endTime &&
          Number(stage.endTime) > nowInSeconds &&
          stage.stage === 'public-sale'),
    );
  }, [trendingMint, tokenId]);

  return useMemo(() => {
    return {
      price: {
        amount: stage?.price?.amount?.decimal,
        currency: stage?.price?.currency?.symbol,
      },
      creatorAddress: trendingMint?.collection?.creatorAddress as `0x${string}`,
      maxMintsPerWallet: stage?.maxMintsPerWallet,
      isEligibleToMint:
        trendingMint?.takerEligibility?.eligibleForCollection &&
        trendingMint?.collection?.isMinting,
      totalOwners: Number(tokenOwnerInfo?.totalOwners),
      recentOwners: recentMints?.data?.map((mint) => mint.to),
      callData: mintToken?.callData,
      mintError: mintToken?.error,
    };
  }, [trendingMint, mintToken, recentMints, tokenOwnerInfo, stage]);
}
