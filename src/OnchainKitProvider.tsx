import { createContext, useMemo } from 'react';
import { ONCHAIN_KIT_CONFIG, setOnchainKitConfig } from './OnchainKitConfig';
import { checkHashLength } from './internal/utils/checkHashLength';
import type { OnchainKitContextType, OnchainKitProviderReact } from './types';

export const OnchainKitContext =
  createContext<OnchainKitContextType>(ONCHAIN_KIT_CONFIG);

/**
 * Provides the OnchainKit React Context to the app.
 */
export function OnchainKitProvider({
  address,
  apiKey,
  chain,
  children,
  appearance,
  projectId,
  rpcUrl,
  schemaId,
}: OnchainKitProviderReact) {
  if (schemaId && !checkHashLength(schemaId, 64)) {
    throw Error('EAS schemaId must be 64 characters prefixed with "0x"');
  }

  const value = useMemo(() => {
    const onchainKitConfig = {
      address: address ?? null,
      apiKey: apiKey ?? null,
      chain: chain,
      appearance: {
        mode: appearance?.mode ?? 'auto',
        theme: appearance?.theme ?? 'default',
      },
      projectId: projectId ?? null,
      rpcUrl: rpcUrl ?? null,
      schemaId: schemaId ?? null,
    };
    setOnchainKitConfig(onchainKitConfig);
    return onchainKitConfig;
  }, [address, apiKey, chain, appearance, projectId, rpcUrl, schemaId]);

  return (
    <OnchainKitContext.Provider value={value}>
      {children}
    </OnchainKitContext.Provider>
  );
}
