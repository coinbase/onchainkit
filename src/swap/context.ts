import { createContext, useContext } from 'react';
import type { SwapContextType } from './types';

export const SwapContext = createContext<SwapContextType>(
  {} as SwapContextType,
);

export function useSwapContext() {
  const context = useContext(SwapContext);
  if (context === undefined) {
    throw new Error('useSwapContext must be used within a Swap component');
  }
  return context;
}
