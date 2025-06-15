'use client';
import { useMemo, type ReactNode } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import type { Chain } from 'wagmi/chains';
import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import type { EASSchemaUid } from '@/identity/types';
import OnchainKitProviderBoundary from './OnchainKitProviderBoundary';
import type { AppConfig } from '../../core/types';
import { checkHashLength } from '../../internal/utils/checkHashLength';
import { COINBASE_VERIFIED_ACCOUNT_SCHEMA_ID } from '../../identity/constants';
import { DEFAULT_PRIVACY_URL, DEFAULT_TERMS_URL } from '../../core/constants';
import { DefaultOnchainKitProviders } from './DefaultOnchainKitProviders';
import { generateUUIDWithInsecureFallback } from '../../utils/crypto';
import { OnchainKitContext } from '../hooks/useOnchainKit';
import type { MiniKitOptions } from '../../minikit/types';
import { MiniKitProvider } from '@/minikit/MiniKitProvider';

export type OnchainKitProviderReact = {
  analytics?: boolean;
  apiKey?: string;
  chain: Chain;
  children: ReactNode;
  config?: AppConfig;
  sessionId?: string;
  projectId?: string;
  rpcUrl?: string;
  schemaId?: EASSchemaUid;
  miniKit?: MiniKitOptions;
};

/**
 * Provides the OnchainKit React Context to the app.
 */
export function OnchainKitProvider({
  analytics,
  apiKey,
  chain,
  children,
  config,
  projectId,
  rpcUrl,
  schemaId,
  miniKit = {
    enabled: false,
  },
}: OnchainKitProviderReact) {
  if (schemaId && !checkHashLength(schemaId, 64)) {
    throw Error('EAS schemaId must be 64 characters prefixed with "0x"');
  }

  const [sessionId] = useSessionStorage(
    'ock-session-id',
    generateUUIDWithInsecureFallback(),
  );

  // eslint-disable-next-line complexity
  const value = useMemo(() => {
    const defaultPaymasterUrl = apiKey
      ? `https://api.developer.coinbase.com/rpc/v1/${chain.name
          .replace(' ', '-')
          .toLowerCase()}/${apiKey}`
      : null;
    const onchainKitConfig = {
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
      <MiniKitProvider
        enabled={miniKit.enabled}
        notificationProxyUrl={miniKit.notificationProxyUrl}
      >
        <DefaultOnchainKitProviders>
          <OnchainKitProviderBoundary>{children}</OnchainKitProviderBoundary>
        </DefaultOnchainKitProviders>
      </MiniKitProvider>
    </OnchainKitContext.Provider>
  );
}
