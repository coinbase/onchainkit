import { createContext, useContext } from 'react';
import type { WalletContextType } from './types';

const emptyContext = {} as WalletContextType;

export const WalletContext = createContext<WalletContextType>(emptyContext);

export function useWalletContext() {
  return useContext(WalletContext);
}
