import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren, useMemo, useState } from 'react';
import { Config, WagmiProvider } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { createWagmiConfig } from './core/createWagmiConfig';
import { useProviderDependencies } from './internal/hooks/useProviderDependencies';
import { useOnchainKit } from './useOnchainKit';

export function DefaultOnchainKitProviders({ children }: PropsWithChildren) {
  // Check the React context for WagmiProvider and QueryClientProvider
  const { providedWagmiConfig, providedQueryClient } =
    useProviderDependencies();

  return (
    <WagmiProviderWithDefault providedWagmiConfig={providedWagmiConfig}>
      <QueryClientProviderWithDefault providedQueryClient={providedQueryClient}>
        {children}
      </QueryClientProviderWithDefault>
    </WagmiProviderWithDefault>
  );
}

function WagmiProviderWithDefault({
  children,
  providedWagmiConfig,
}: PropsWithChildren<{
  providedWagmiConfig: Config | null;
}>) {
  const onchainKitConfig = useOnchainKit();

  const [config] = useState(() => {
    if (providedWagmiConfig) return providedWagmiConfig;

    const appName = onchainKitConfig.config?.appearance?.name ?? undefined;
    const appLogoUrl = onchainKitConfig.config?.appearance?.logo ?? undefined;

    return createWagmiConfig({
      apiKey: onchainKitConfig.apiKey ?? undefined,
      appName,
      appLogoUrl,
      connectors: [
        coinbaseWallet({
          appName,
          appLogoUrl,
          preference: onchainKitConfig.config?.wallet?.preference,
        }),
      ],
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
