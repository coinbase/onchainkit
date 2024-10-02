import { useContext, createContext, useMemo } from 'react';
import type { NftMintContextType, NftMintProviderReact } from '../types';
import { useValue } from '../../internal/hooks/useValue';
import { useTrendingMint } from '../hooks/useTrendingMint';
import { useAccount, useChainId } from 'wagmi';
import { useAggregatedCollectionDetails } from '../hooks/useAggregatedCollectionDetails';

const emptyContext = {} as NftMintContextType;

export const NftMintContext = createContext<NftMintContextType>(emptyContext);

export function useNftMintContext() {
  const context = useContext(NftMintContext);
  if (context === emptyContext) {
    throw new Error(
      'useNftMintContext must be used within an NftMint component',
    );
  }
  return context;
}

export function NftMintProvider({
  children,
  contractAddress,
  tokenId,
}: NftMintProviderReact) {
  const { address } = useAccount();
  const chainId = useChainId();

  const { data: trendingMint } = useTrendingMint({
    address: contractAddress,
    takerAddress: address,
  });

  const { data: tokenOwnerInfo } = useAggregatedCollectionDetails({
    contractAddress,
    chainId,
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
  }, [tokenId, trendingMint]);

  const value = useValue({
    contractAddress,
    tokenId,
    maxMintsPerWallet: stage?.maxMintsPerWallet,
    price: stage?.price,
    network: trendingMint?.collection?.network,
    isEligibleToMint:
      trendingMint?.takerEligibility?.eligibleForCollection &&
      trendingMint?.collection?.isMinting,
    creatorAddress: trendingMint?.collection?.creatorAddress as `0x${string}`,
    totalTokens: tokenOwnerInfo?.totalTokens,
    totalOwners: tokenOwnerInfo?.totalOwners,
  });

  return (
    <NftMintContext.Provider value={value}>{children}</NftMintContext.Provider>
  );
}
