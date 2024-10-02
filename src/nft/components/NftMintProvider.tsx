import { createContext, useCallback, useContext, useState } from 'react';
import { useValue } from '../../internal/hooks/useValue';
import type { NftMintContextType, NftMintProviderReact } from '../types';
import { useNftContext } from './NftProvider';

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
  useNftMintData,
  buildMintTransaction,
  children,
}: NftMintProviderReact) {
  const [quantity, setQuantity] = useState(1);
  const { contractAddress, tokenId } = useNftContext();

  const mintData = useNftMintData({
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
    <NftMintContext.Provider value={value}>{children}</NftMintContext.Provider>
  );
}
