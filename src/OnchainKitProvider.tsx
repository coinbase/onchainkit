'use client';

import {
  ONCHAIN_KIT_CONFIG,
  setOnchainKitConfig,
} from '@/core/OnchainKitConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useMemo } from 'react';
import { WagmiProvider } from 'wagmi';
import OnchainKitProviderBoundary from './OnchainKitProviderBoundary';
import { DEFAULT_PRIVACY_URL, DEFAULT_TERMS_URL } from './core/constants';
import { createWagmiConfig } from './core/createWagmiConfig';
import type { OnchainKitContextType } from './core/types';
import { COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID } from './identity/constants';
import { useProviderDependencies } from './internal/hooks/useProviderDependencies';
import { checkHashLength } from './internal/utils/checkHashLength';
import type { OnchainKitProviderReact } from './types';

export const OnchainKitContext =
  createContext<OnchainKitContextType>(ONCHAIN_KIT_CONFIG);

/**
 * Provides the OnchainKit React Context to the app.
 */
export function OnchainKitProvider({
  address,
  analytics,
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

  const sessionId = useMemo(() => crypto.randomUUID(), []);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ignore
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
        analytics: analytics ?? true,
        analyticsUrl: config?.analyticsUrl ?? null,
        appearance: {
          name: config?.appearance?.name ?? 'Dapp',
          logo: config?.appearance?.logo ?? '',
          mode: config?.appearance?.mode ?? 'auto',
          theme: config?.appearance?.theme ?? 'default',
        },
        paymaster: config?.paymaster || defaultPaymasterUrl,
        wallet: {
          display: config?.wallet?.display ?? 'classic',
          termsUrl: config?.wallet?.termsUrl || DEFAULT_TERMS_URL,
          privacyUrl: config?.wallet?.privacyUrl || DEFAULT_PRIVACY_URL,
        },
      },
      projectId: projectId ?? null,
      rpcUrl: rpcUrl ?? null,
      schemaId: schemaId ?? COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID,
      sessionId,
    };
    setOnchainKitConfig(onchainKitConfig);
    return onchainKitConfig;
  }, [
    address,
    analytics,
    apiKey,
    chain,
    config,
    projectId,
    rpcUrl,
    schemaId,
    sessionId,
  ]);

  // Check the React context for WagmiProvider and QueryClientProvider
  const { providedWagmiConfig, providedQueryClient } =
    useProviderDependencies();

  const defaultConfig = useMemo(() => {
    // IMPORTANT: Don't create a new Wagmi configuration if one already exists
    // This prevents the user-provided WagmiConfig from being overridden
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
  const defaultQueryClient = useMemo(() => {
    // IMPORTANT: Don't create a new QueryClient if one already exists
    // This prevents the user-provided QueryClient from being overridden
    return providedQueryClient || new QueryClient();
  }, [providedQueryClient]);

  // If both dependencies are missing, return a context with default parent providers
  // If only one dependency is provided, expect the user to also provide the missing one
  if (!providedWagmiConfig && !providedQueryClient) {
    return (
      <WagmiProvider config={defaultConfig}>
        <QueryClientProvider client={defaultQueryClient}>
          <OnchainKitContext.Provider value={value}>
            <OnchainKitProviderBoundary>{children}</OnchainKitProviderBoundary>
          </OnchainKitContext.Provider>
        </QueryClientProvider>
      </WagmiProvider>
    );
  }

  return (
    <OnchainKitContext.Provider value={value}>
      <OnchainKitProviderBoundary>{children}</OnchainKitProviderBoundary>
    </OnchainKitContext.Provider>
  );
}
