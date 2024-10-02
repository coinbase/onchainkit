import { useContext, createContext, useCallback, useState } from 'react';
import type {
  NftQuantityContextType,
  NftQuantityProviderReact,
} from '../types';
import { useValue } from '../../internal/hooks/useValue';
const emptyContext = {} as NftQuantityContextType;

export const NftQuantityContext =
  createContext<NftQuantityContextType>(emptyContext);

export function useNftQuantityContext() {
  const context = useContext(NftQuantityContext);
  if (context === emptyContext) {
    throw new Error(
      'useNftQuantityContext must be used within an NftMint component',
    );
  }
  return context;
}

export function NftQuantityProvider({ children }: NftQuantityProviderReact) {
  const [quantity, setQuantity] = useState(1);

  const handleSetQuantity = useCallback((quantity: string) => {
    setQuantity(Number.parseInt(quantity, 10));
  }, []);

  const value = useValue({
    quantity,
    setQuantity: handleSetQuantity,
  });

  return (
    <NftQuantityContext.Provider value={value}>
      {children}
    </NftQuantityContext.Provider>
  );
}
