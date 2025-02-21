import { useMemo, type PropsWithChildren } from "react";
import { useProviderDependencies } from "./internal/hooks/useProviderDependencies";
import { createWagmiConfig } from "./core/createWagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import type { CreateWagmiConfigParams } from "./core/types";

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

    const defaultConfig = useMemo(() => {
    // IMPORTANT: Don't create a new Wagmi configuration if one already exists
    // This prevents the user-provided WagmiConfig from being overridden
    return (
      providedWagmiConfig ||
      createWagmiConfig({
        apiKey,
        appName,
        appLogoUrl,
        connectors,
      })
    );
  }, [
    apiKey,
    appName,
    appLogoUrl,
    connectors,
    providedWagmiConfig,
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
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    );
  }

  return children;
}