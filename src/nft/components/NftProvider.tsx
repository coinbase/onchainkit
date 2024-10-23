import { createContext, useCallback, useContext, useState } from 'react';
import { useValue } from '../../internal/hooks/useValue';
import type { NftContextType, NftProviderReact } from '../types';

const emptyContext = {} as NftContextType;

export const NftContext = createContext<NftContextType>(emptyContext);

export function useNftContext() {
  const context = useContext(NftContext);
  if (context === emptyContext) {
    throw new Error(
      'useNftContext must be used within an NftView or NftMint component',
    );
  }
  return context;
}

export function NftProvider({
  children,
  contractAddress,
  tokenId,
  useNftData,
  buildMintTransaction,
}: NftProviderReact) {
  const [quantity, setQuantity] = useState(1);

  const nftData = useNftData(contractAddress, tokenId);

  const handleSetQuantity = useCallback((quantity: string) => {
    setQuantity(Number.parseInt(quantity, 10));
  }, []);

  const value = useValue({
    contractAddress,
    tokenId,
    quantity,
    setQuantity: handleSetQuantity,
    buildMintTransaction,
    ...nftData,
  });

  return <NftContext.Provider value={value}>{children}</NftContext.Provider>;
}
