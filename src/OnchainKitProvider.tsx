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
  schemaId,
}: OnchainKitProviderProps) {
  if (schemaId && !checkHashLength(schemaId, 64)) {
    throw Error('EAS schemaId must be 64 characters prefixed with "0x"');
  }
  if (!apiKey) {
    throw Error(
      'API Key is required to use OnchainKit - get your API key from the Coinbase Developer Platform: https://portal.cdp.coinbase.com/products/templates',
    );
  }
  const value = useMemo(() => {
    return {
      address: address ?? null,
      apiKey: apiKey,
      rpcUrl: `https://api.developer.coinbase.com/rpc/v1/${ONCHAIN_KIT_CONFIG.chain.name.replace(' ', '-').toLowerCase()}/${ONCHAIN_KIT_CONFIG.apiKey}`,
      chain: chain,
      schemaId: schemaId ?? null,
    };
  }, [address, chain, schemaId]);
  return <OnchainKitContext.Provider value={value}>{children}</OnchainKitContext.Provider>;
}
