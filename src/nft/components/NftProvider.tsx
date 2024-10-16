import { useContext, createContext } from 'react';
import type { NftProviderReact, NftContextType } from '../types';
import { useValue } from '../../internal/hooks/useValue';
import { useNftData as defaultUseNftData } from '../hooks/useNftData';

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
  useNftData = defaultUseNftData,
}: NftProviderReact) {
  const nftData = useNftData(contractAddress, tokenId);

  const value = useValue({
    contractAddress,
    tokenId,
    ...nftData,
  });

  return <NftContext.Provider value={value}>{children}</NftContext.Provider>;
}