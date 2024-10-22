import { createContext, useCallback, useContext, useState } from 'react';
import { useValue } from '../../internal/hooks/useValue';
import type { NFTMintContextType, NFTMintProviderReact } from '../types';
import { useNFTContext } from './NFTProvider';

const emptyContext = {} as NFTMintContextType;

export const NFTMintContext = createContext<NFTMintContextType>(emptyContext);

export function useNFTMintContext() {
  const context = useContext(NFTMintContext);
  if (context === emptyContext) {
    throw new Error(
      'useNFTMintContext must be used within an NFTMint component',
    );
  }
  return context;
}

export function NFTMintProvider({
  useNFTMintData,
  buildMintTransaction,
  children,
}: NFTMintProviderReact) {
  const [quantity, setQuantity] = useState(1);
  const { contractAddress, tokenId } = useNFTContext();

  const mintData = useNFTMintData({
    contractAddress,
    tokenId,
    quantity,
  });

  const handleSetQuantity = useCallback((quantity: string) => {
    setQuantity(Number.parseInt(quantity, 10));
  }, []);

  const value = useValue({
    quantity,
    setQuantity: handleSetQuantity,
    price: mintData?.price,
    mintFee: mintData?.mintFee,
    creatorAddress: mintData?.creatorAddress,
    maxMintsPerWallet: mintData?.maxMintsPerWallet,
    isEligibleToMint: mintData?.isEligibleToMint,
    totalOwners: mintData?.totalOwners,
    recentOwners: mintData?.recentOwners,
    buildMintTransaction,
  });

  return (
    <NFTMintContext.Provider value={value}>{children}</NFTMintContext.Provider>
  );
}
