import { createContext, useContext } from 'react';
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
}: NftProviderReact) {
  const nftData = useNftData(contractAddress, tokenId);

  const value = useValue({
    contractAddress,
    tokenId,
    ...nftData,
  });

  return <NftContext.Provider value={value}>{children}</NftContext.Provider>;
}
