import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Config, WagmiProvider } from 'wagmi';
import { baseAccount } from 'wagmi/connectors';
import { createWagmiConfig } from './core/createWagmiConfig';
import { useProviderDependencies } from './internal/hooks/useProviderDependencies';
import { useOnchainKit } from './useOnchainKit';
import type { CreateWagmiConfigParams } from './core/types';

export function DefaultOnchainKitProviders({
  children,
  connectors,
}: PropsWithChildren<{ connectors?: CreateWagmiConfigParams['connectors'] }>) {
  // Check the React context for WagmiProvider and QueryClientProvider
  const { providedWagmiConfig, providedQueryClient } =
    useProviderDependencies();

  return (
    <WagmiProviderWithDefault
      providedWagmiConfig={providedWagmiConfig}
      connectors={connectors}
    >
      <QueryClientProviderWithDefault providedQueryClient={providedQueryClient}>
        {children}
      </QueryClientProviderWithDefault>
    </WagmiProviderWithDefault>
  );
}

function WagmiProviderWithDefault({
  children,
  providedWagmiConfig,
  connectors,
}: PropsWithChildren<{
  providedWagmiConfig: Config | null;
  connectors?: CreateWagmiConfigParams['connectors'];
}>) {
  const onchainKitConfig = useOnchainKit();
  const prevConnectorsRef =
    useRef<CreateWagmiConfigParams['connectors']>(connectors);

  const getWagmiConfig = useCallback(() => {
    if (providedWagmiConfig) return providedWagmiConfig;

    const appName = onchainKitConfig.config?.appearance?.name ?? undefined;
    const appLogoUrl = onchainKitConfig.config?.appearance?.logo ?? undefined;

    return createWagmiConfig({
      apiKey: onchainKitConfig.apiKey ?? undefined,
      appName,
      appLogoUrl,
      connectors: connectors ?? [
        baseAccount({
          appName,
          appLogoUrl,
        }),
      ],
    });
  }, [
    onchainKitConfig.apiKey,
    onchainKitConfig.config,
    connectors,
    providedWagmiConfig,
  ]);

  const [config, setConfig] = useState(() => {
    return getWagmiConfig();
  });

  useEffect(() => {
    if (prevConnectorsRef.current !== connectors) {
      setConfig(getWagmiConfig());
      prevConnectorsRef.current = connectors;
    }
  }, [connectors, getWagmiConfig]);

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
