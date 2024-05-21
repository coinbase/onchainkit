import { createContext, useMemo } from 'react';
import { checkHashLength } from './utils/checkHashLength';
import { ONCHAIN_KIT_CONFIG } from './OnchainKitConfig';
import { OnchainKitContextType, OnchainKitProviderProps } from './types';

export const OnchainKitContext = createContext<OnchainKitContextType>(ONCHAIN_KIT_CONFIG);

/**
 * Provides the OnchainKit React Context to the app.
 */
export function OnchainKitProvider({
  address,
  apiKey,
  chain,
  children,
  rpcUrl,
  schemaId,
}: OnchainKitProviderProps) {
  if (schemaId && !checkHashLength(schemaId, 64)) {
    throw Error('EAS schemaId must be 64 characters prefixed with "0x"');
  }
  const value = useMemo(() => {
    return {
      address: address ?? null,
      apiKey: apiKey ?? null,
      chain: chain,
      rpcUrl: rpcUrl ?? null,
      schemaId: schemaId ?? null,
    };
  }, [address, chain, schemaId, apiKey, rpcUrl]);
  return <OnchainKitContext.Provider value={value}>{children}</OnchainKitContext.Provider>;
}
