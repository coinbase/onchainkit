import { createContext, useMemo } from 'react';
import { checkHashLength } from './utils/checkHashLength';
import { OnchainKitContextType, OnchainKitProviderProps } from './types';

export const OnchainKitContext = createContext<OnchainKitContextType | null>(null);

/**
 * Provides the OnchainKit React Context to the app.
 */
export function OnchainKitProvider({
  address,
  chain,
  children,
  schemaId,
}: OnchainKitProviderProps) {
  if (schemaId && !checkHashLength(schemaId, 64)) {
    throw Error('EAS schemaId must be 64 characters prefixed with "0x"');
  }
  const value = useMemo(() => {
    return {
      address: address ?? null,
      chain: chain,
      schemaId: schemaId ?? null,
    };
  }, [address, chain, schemaId]);
  return <OnchainKitContext.Provider value={value}>{children}</OnchainKitContext.Provider>;
}
