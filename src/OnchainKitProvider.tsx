import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useMemo } from 'react';
import { WagmiProvider, WagmiProviderNotFoundError, useConfig } from 'wagmi';
import { ONCHAIN_KIT_CONFIG, setOnchainKitConfig } from './OnchainKitConfig';
import { getDefaultConfig } from './getDefaultConfig';
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
  config,
  projectId,
  rpcUrl,
  schemaId,
}: OnchainKitProviderReact) {
  if (schemaId && !checkHashLength(schemaId, 64)) {
    throw Error('EAS schemaId must be 64 characters prefixed with "0x"');
  }

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor the configurations
  const value = useMemo(() => {
    const defaultPaymasterUrl = apiKey
      ? `https://api.developer.coinbase.com/rpc/v1/${chain.name
          .replace(' ', '-')
          .toLowerCase()}/${apiKey}`
      : null;
    const onchainKitConfig = {
      address: address ?? null,
      apiKey: apiKey ?? null,
      chain: chain,
      config: {
        appearance: {
          name: config?.appearance?.name ?? 'My OnchainKit App',
          logo:
            config?.appearance?.logo ||
            'https://onchainkit.xyz/favicon/48x48.png?v4-19-24',
          mode: config?.appearance?.mode ?? 'auto',
          theme: config?.appearance?.theme ?? 'default',
        },
        paymaster: config?.paymaster || defaultPaymasterUrl,
      },
      projectId: projectId ?? null,
      rpcUrl: rpcUrl ?? null,
      schemaId: schemaId ?? null,
    };
    setOnchainKitConfig(onchainKitConfig);
    return onchainKitConfig;
  }, [address, apiKey, chain, config, projectId, rpcUrl, schemaId]);

  // Check the context for WagmiProvider
  // Wagmi configuration defaults to the provided config if it exists
  // Otherwise, use the OnchainKit-provided Wagmi configuration
  let providedConfig = null;
  try {
    providedConfig = useConfig();
  } catch (error) {
    if (!(error instanceof WagmiProviderNotFoundError)) {
      console.error('Error fetching config, using OnchainKit defaults:', error);
      throw error;
    }
  }

  // If WagmiProvider is not found, return the context with defaulted parent providers
  if (!providedConfig) {
    return (
      <WagmiProvider
        config={getDefaultConfig({
          apiKey,
          appName: value.config.appearance.name,
          appLogoUrl: value.config.appearance.logo,
        })}
      >
        <QueryClientProvider client={new QueryClient()}>
          <OnchainKitContext.Provider value={value}>
            {children}
          </OnchainKitContext.Provider>
        </QueryClientProvider>
      </WagmiProvider>
    );
  }

  return (
    <OnchainKitContext.Provider value={value}>
      {children}
    </OnchainKitContext.Provider>
  );
}
