import { createContext, useContext } from 'react';
import { ONCHAIN_KIT_CONFIG } from '@/core/OnchainKitConfig';
import { OnchainKitContextType } from './core/types';

export const OnchainKitContext =
  createContext<OnchainKitContextType>(ONCHAIN_KIT_CONFIG);

export function useOnchainKit() {
  return useContext(OnchainKitContext);
}
