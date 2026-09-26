'use client';
import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { useContext, useEffect, useLayoutEffect, useMemo } from 'react';
import { DefaultOnchainKitProviders } from './DefaultOnchainKitProviders';
import OnchainKitProviderBoundary from './OnchainKitProviderBoundary';
import { generateUUIDWithInsecureFallback } from './internal/utils/crypto';
import { OnchainKitContext } from './useOnchainKit';
import { useThemeRoot } from './internal/hooks/useTheme';
import { clientMetaManager } from './core/clientMeta/clientMetaManager';
import { MiniKitContext } from './minikit/MiniKitProvider';
import { validateOnchainKitConfig } from './core/utils/validateOnchainKitConfig';

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
  sessionId?: string;
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
  // Validate configuration on mount - throws descriptive errors for invalid config
  useEffect(() => {
    validateOnchainKitConfig({ apiKey, chain, config, projectId, rpcUrl });
  }, [apiKey, chain, config, projectId, rpcUrl]);

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

  const value = useMemo(() => {
    return {
      analytics,
      apiKey,
      chain,
      config: {
        ...config,
        appearance: {
          ...config?.appearance,
        },
      },
      projectId,
      rpcUrl,
      sessionId,
    };
  }, [analytics, apiKey, chain, config, projectId, rpcUrl, sessionId]);

  useEffect(() => {
    setOnchainKitConfig({
      apiKey,
      chain,
      config,
      projectId,
      rpcUrl,
    });
  }, [apiKey, chain, config, projectId, rpcUrl]);

  useEffect(() => {
    // Initialize client metadata
    clientMetaManager.setClientMeta({
      version: process.env.PACKAGE_VERSION ?? 'unknown',
      analytics,
    });
  }, [analytics]);

  // If already inside MiniKitProvider, don't wrap again
  if (isMiniKit) {
    return (
      <OnchainKitContext.Provider value={value}>
        {children}
      </OnchainKitContext.Provider>
    );
  }

  return (
    <OnchainKitProviderBoundary>
      <MiniKitProvider
        config={miniKit}
        defaultPublicClients={defaultPublicClients}
      >
        <DefaultOnchainKitProviders
          apiKey={apiKey}
          chain={chain}
          config={config}
          projectId={projectId}
          rpcUrl={rpcUrl}
        >
          <OnchainKitContext.Provider value={value}>
            {children}
          </OnchainKitContext.Provider>
        </DefaultOnchainKitProviders>
      </MiniKitProvider>
    </OnchainKitProviderBoundary>
  );
}
