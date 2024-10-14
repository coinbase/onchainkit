import { useState, useContext, createContext, useCallback } from 'react';
import type { NftMintContextType, NftMintProviderReact } from '../types';
import { useValue } from '../../internal/hooks/useValue';
import { useNftContext } from './NftProvider';
import { useNftMintData as defaultUseMintData } from '../hooks/useNftMintData';

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
  useNftMintData = defaultUseMintData,
  children,
}: NftMintProviderReact) {
  const [quantity, setQuantity] = useState(1);
  const { contractAddress, tokenId, contractType } = useNftContext();

  const mintData = useNftMintData({
    contractAddress, 
    tokenId: tokenId ?? '1', 
    contractType,
    quantity
  });

  const handleSetQuantity = useCallback((quantity: string) => {
    setQuantity(Number.parseInt(quantity, 10));
  }, []);

  const value = useValue({
    quantity,
    setQuantity: handleSetQuantity,
    price: mintData?.price,
    creatorAddress: mintData?.creatorAddress,
    maxMintsPerWallet: mintData?.maxMintsPerWallet,
    isEligibleToMint: mintData?.isEligibleToMint,
    totalOwners: mintData?.totalOwners,
    callData: mintData?.callData,
    mintError: mintData?.mintError,
    recentOwners: mintData?.recentOwners,
  });

  return (
    <NftMintContext.Provider value={value}>{children}</NftMintContext.Provider>
  );
}
