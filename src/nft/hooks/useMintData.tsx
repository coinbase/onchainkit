import { useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useMintToken } from '../hooks/useMintToken';
import { useTrendingMint } from '../hooks/useTrendingMint';
import { useAggregatedCollectionDetails } from './useAggregatedCollectionDetails';

export function useMintData(contractAddress: `0x${string}`, tokenId: string, quantity: number) {
  const chainId = useChainId();
  const { address } = useAccount();

  const { data: trendingMint } = useTrendingMint({
    address: contractAddress,
    takerAddress: address,
  });

  const { data: tokenOwnerInfo } = useAggregatedCollectionDetails({
    contractAddress,
    chainId,
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

  // figure out why error isn't returning correctly

  // console.log('error', 'isError', isError);
  // console.log('error', 'error', error);

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
      creatorAddress:  trendingMint?.collection?.creatorAddress as `0x${string}`,
      maxMintsPerWallet: stage?.maxMintsPerWallet,
      isEligibleToMint: trendingMint?.takerEligibility?.eligibleForCollection && trendingMint?.collection?.isMinting,
      totalOwners: Number(tokenOwnerInfo?.totalOwners),
      callData: mintToken?.callData,
      mintError: mintToken?.error,
    };
  }, [trendingMint, mintToken, tokenOwnerInfo, stage])
}
