import { createContext, useCallback, useContext, useState } from 'react';
import { useValue } from '../../internal/hooks/useValue';
import type { NFTContextType, NFTProviderReact } from '../types';

const emptyContext = {} as NFTContextType;

export const NFTContext = createContext<NFTContextType>(emptyContext);

export function useNFTContext() {
  const context = useContext(NFTContext);
  if (context === emptyContext) {
    throw new Error(
      'useNFTContext must be used within an NFTView or NFTMint component',
    );
  }
  return context;
}

export function NFTProvider({
  children,
  contractAddress,
  tokenId,
  isSponsored,
  useNFTData,
  buildMintTransaction,
}: NFTProviderReact) {
  const [quantity, setQuantity] = useState(1);

  const nftData = useNFTData(contractAddress, tokenId);

  const handleSetQuantity = useCallback((quantity: string) => {
    setQuantity(Number.parseInt(quantity, 10));
  }, []);

  const value = useValue({
    contractAddress,
    tokenId,
    isSponsored,
    quantity,
    setQuantity: handleSetQuantity,
    buildMintTransaction,
    ...nftData,
  });

  return <NFTContext.Provider value={value}>{children}</NFTContext.Provider>;
}
