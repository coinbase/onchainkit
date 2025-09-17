'use client';
import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { useContext, useEffect, useLayoutEffect, useMemo } from 'react';
import { DefaultOnchainKitProviders } from './DefaultOnchainKitProviders';
import OnchainKitProviderBoundary from './OnchainKitProviderBoundary';
import { DEFAULT_PRIVACY_URL, DEFAULT_TERMS_URL } from './core/constants';
import { generateUUIDWithInsecureFallback } from './internal/utils/crypto';
import { OnchainKitContext } from './useOnchainKit';
import { useThemeRoot } from './internal/hooks/useTheme';
import { clientMetaManager } from './core/clientMeta/clientMetaManager';
import { MiniKitContext } from './minikit/MiniKitProvider';

import { type ReactNode } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import type { Chain } from 'wagmi/chains';
import type { AppConfig } from './core/types';
import type { MiniKitOptions } from './minikit/types';
import { MiniKitProvider } from '@/minikit/MiniKitProvider';
import { type PublicClient } from 'viem';

export type OnchainKitProviderReact = {
  analytics?: boolean;
  apiKey?: string;
  chain: Chain;
  children: ReactNode;
  config?: AppConfig;
  projectId?: string;
  rpcUrl?: string;
  miniKit?: MiniKitOptions;
  defaultPublicClients?: {
    [chainId: number]: PublicClient;
  };
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
  miniKit = {
    enabled: false,
  },
  defaultPublicClients,
}: OnchainKitProviderReact) {
  const [sessionId] = useSessionStorage(
    'ock-session-id',
    generateUUIDWithInsecureFallback(),
  );

  const theme = useThemeRoot({
    theme: config?.appearance?.theme,
    mode: config?.appearance?.mode,
  });

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-ock-theme', theme);
  }, [theme]);
  const isMiniKit = !!useContext(MiniKitContext)?.__isMiniKit;

  useEffect(() => {
    if (clientMetaManager.isInitialized()) return;
    clientMetaManager.init({ isMiniKit });
  }, [isMiniKit]);

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
      sessionId,
      defaultPublicClients,
      miniKit,
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
    sessionId,
    defaultPublicClients,
    miniKit,
  ]);

  return (
    <OnchainKitContext.Provider value={value}>
      <DefaultOnchainKitProviders>
        <MiniKitProvider
          enabled={miniKit.enabled}
          notificationProxyUrl={miniKit.notificationProxyUrl}
        >
          <OnchainKitProviderBoundary>{children}</OnchainKitProviderBoundary>
        </MiniKitProvider>
      </DefaultOnchainKitProviders>
    </OnchainKitContext.Provider>
  );
}
