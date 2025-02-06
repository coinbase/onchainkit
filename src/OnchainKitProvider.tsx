'use client';

import {
  ONCHAIN_KIT_CONFIG,
  setOnchainKitConfig,
} from '@/core/OnchainKitConfig';
import { createContext, useMemo } from 'react';
import { DEFAULT_PRIVACY_URL, DEFAULT_TERMS_URL } from './core/constants';
import type { OnchainKitContextType } from './core/types';
import { COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID } from './identity/constants';
import { checkHashLength } from './internal/utils/checkHashLength';
import type { OnchainKitProviderReact } from './types';
import { DefaultOnchainKitProviders } from './DefaultOnchainKitProviders';
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

  return (
    <DefaultOnchainKitProviders
      apiKey={apiKey}
      appName={value.config.appearance.name}
      appLogoUrl={value.config.appearance.logo}
    >
      <OnchainKitContext.Provider value={value}>
        {children}
      </OnchainKitContext.Provider>
    </DefaultOnchainKitProviders>
  );
}
