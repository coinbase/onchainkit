import { useContext, createContext } from 'react';
import type { NftProviderReact, NftContextType } from '../types';
import { useValue } from '../../internal/hooks/useValue';

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
    // name: metadata?.name,
    // description: metadata?.description,
    // image: metadata?.image,
    // ownerAddress: owner as `0x${string}`,
    ...nftData,
  });

  return (
    <NftContext.Provider value={value}>{children}</NftContext.Provider>
  );
}
