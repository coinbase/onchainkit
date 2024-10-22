import { createContext, useContext } from 'react';
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
  useNFTData,
}: NFTProviderReact) {
  const nftData = useNFTData(contractAddress, tokenId);

  const value = useValue({
    contractAddress,
    tokenId,
    ...nftData,
  });

  return <NFTContext.Provider value={value}>{children}</NFTContext.Provider>;
}
