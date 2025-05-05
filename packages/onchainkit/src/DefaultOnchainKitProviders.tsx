import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren, useMemo, useState } from 'react';
import { Config, WagmiProvider } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { createWagmiConfig } from './core/createWagmiConfig';
import type { CreateWagmiConfigParams } from './core/types';
import { useProviderDependencies } from './internal/hooks/useProviderDependencies';

export function DefaultOnchainKitProviders({
  apiKey,
  appName,
  appLogoUrl,
  connectors = [
    coinbaseWallet({
      appName,
      appLogoUrl,
      preference: 'all',
    }),
  ],
  children,
}: PropsWithChildren<CreateWagmiConfigParams>) {
  // Check the React context for WagmiProvider and QueryClientProvider
  const { providedWagmiConfig, providedQueryClient } =
    useProviderDependencies();

  return (
    <WagmiProviderWithDefault
      apiKey={apiKey}
      appName={appName}
      appLogoUrl={appLogoUrl}
      connectors={connectors}
      providedWagmiConfig={providedWagmiConfig}
    >
      <QueryClientProviderWithDefault providedQueryClient={providedQueryClient}>
        {children}
      </QueryClientProviderWithDefault>
    </WagmiProviderWithDefault>
  );
}

function WagmiProviderWithDefault({
  apiKey,
  appName,
  appLogoUrl,
  connectors,
  children,
  providedWagmiConfig,
}: PropsWithChildren<CreateWagmiConfigParams> & {
  providedWagmiConfig: Config | null;
}) {
  const [config] = useState(() => {
    if (providedWagmiConfig) return providedWagmiConfig;

    return createWagmiConfig({
      apiKey,
      appName,
      appLogoUrl,
      connectors,
    });
  });

  if (providedWagmiConfig) {
    return children;
  }

  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}

function QueryClientProviderWithDefault({
  children,
  providedQueryClient,
}: PropsWithChildren<{ providedQueryClient: QueryClient | null }>) {
  const queryClient = useMemo(() => {
    return providedQueryClient || new QueryClient();
  }, [providedQueryClient]);

  if (providedQueryClient) return children;

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
