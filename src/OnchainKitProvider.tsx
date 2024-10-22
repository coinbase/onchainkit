import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useMemo } from 'react';
import { WagmiProvider } from 'wagmi';
import { ONCHAIN_KIT_CONFIG, setOnchainKitConfig } from './OnchainKitConfig';
import { createWagmiConfig } from './createWagmiConfig';
import { checkHashLength } from './internal/utils/checkHashLength';
import type { OnchainKitContextType, OnchainKitProviderReact } from './types';
import { useProviderDependencies } from './useProviderDependencies';

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

  // Check the React context for WagmiProvider and QueryClientProvider
  const { providedWagmiConfig, providedQueryClient } =
    useProviderDependencies();

  const defaultConfig = useMemo(() => {
    // IMPORTANT: Don't create a new Wagmi configuration if one already exists
    // This prevents the user-provided WagmiConfig from being overriden
    return (
      providedWagmiConfig ||
      createWagmiConfig({
        apiKey,
        appName: value.config.appearance.name,
        appLogoUrl: value.config.appearance.logo,
      })
    );
  }, [
    apiKey,
    providedWagmiConfig,
    value.config.appearance.name,
    value.config.appearance.logo,
  ]);
  const queryClient = useMemo(() => {
    // IMPORTANT: Don't create a new QueryClient if one already exists
    // This prevents the user-provided QueryClient from being overriden
    return providedQueryClient || new QueryClient();
  }, [providedQueryClient]);

  // If no dependencies are provided, return a context with default parent providers
  if (!providedWagmiConfig && !providedQueryClient) {
    return (
      <WagmiProvider config={defaultConfig}>
        <QueryClientProvider client={queryClient}>
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
