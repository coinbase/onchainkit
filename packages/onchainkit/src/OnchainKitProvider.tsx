'use client';
import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { useContext, useEffect, useMemo } from 'react';
import { DefaultOnchainKitProviders } from './DefaultOnchainKitProviders';
import OnchainKitProviderBoundary from './OnchainKitProviderBoundary';
import { DEFAULT_PRIVACY_URL, DEFAULT_TERMS_URL } from './core/constants';
import { COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID } from './identity/constants';
import { checkHashLength } from './internal/utils/checkHashLength';
import type { OnchainKitProviderReact } from './types';
import { generateUUIDWithInsecureFallback } from './utils/crypto';
import { OnchainKitContext } from './useOnchainKit';
import { clientMetaManager } from './core/clientMeta/clientMetaManager';
import { MiniKitContext } from './minikit/MiniKitProvider';

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

  const sessionId = useMemo(() => generateUUIDWithInsecureFallback(), []);
  const isMiniKit = !!useContext(MiniKitContext)?.__isMiniKit;

  useEffect(() => {
    if (clientMetaManager.isInitialized()) return;
    clientMetaManager.init({ isMiniKit });
  }, [isMiniKit]);

  // eslint-disable-next-line complexity
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
          preference: config?.wallet?.preference ?? 'all',
          signUpEnabled: config?.wallet?.signUpEnabled ?? true,
          termsUrl: config?.wallet?.termsUrl || DEFAULT_TERMS_URL,
          privacyUrl: config?.wallet?.privacyUrl || DEFAULT_PRIVACY_URL,
          supportedWallets: {
            rabby: config?.wallet?.supportedWallets?.rabby ?? false,
            trust: config?.wallet?.supportedWallets?.trust ?? false,
            frame: config?.wallet?.supportedWallets?.frame ?? false,
          },
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
    <OnchainKitContext.Provider value={value}>
      <DefaultOnchainKitProviders>
        <OnchainKitProviderBoundary>{children}</OnchainKitProviderBoundary>
      </DefaultOnchainKitProviders>
    </OnchainKitContext.Provider>
  );
}
