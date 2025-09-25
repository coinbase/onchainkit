'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren, useContext, useMemo } from 'react';
import { Config, WagmiProvider } from 'wagmi';
import { baseAccount, coinbaseWallet } from 'wagmi/connectors';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';
import { MiniKitContext } from '@/minikit/MiniKitProvider';
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
  // Using useContext here because useMiniKit throws if MiniKit is not enabled
  const miniKit = useContext(MiniKitContext);

  const apiKey = onchainKitConfig.apiKey ?? undefined;
  const appName = onchainKitConfig.config?.appearance?.name ?? undefined;
  const appLogoUrl = onchainKitConfig.config?.appearance?.logo ?? undefined;
  const walletPreference = onchainKitConfig.config?.wallet?.preference ?? 'all';

  const defaultConnector = useMemo(() => {
    // MiniKit context varsa farcasterMiniApp kullan
    if (miniKit?.context) {
      return farcasterMiniApp();
    }

    // Wallet preference'a göre connector seç
    switch (walletPreference) {
      case 'smartWalletOnly':
        return baseAccount({
          appName,
          appLogoUrl,
        });
      case 'eoaOnly':
        return coinbaseWallet({
          appName,
          appLogoUrl,
          preference: 'eoaOnly',
        });
      case 'all':
      default:
        return baseAccount({
          appName,
          appLogoUrl,
        });
    }
  }, [appName, appLogoUrl, miniKit?.context, walletPreference]);

  const defaultConfig = useMemo(() => {
    if (providedWagmiConfig) return providedWagmiConfig;

    return createWagmiConfig({
      apiKey,
      appName,
      appLogoUrl,
      connectors: [defaultConnector],
    });
  }, [providedWagmiConfig, defaultConnector, apiKey, appName, appLogoUrl]);

  if (providedWagmiConfig) {
    return children;
  }

  return <WagmiProvider config={defaultConfig}>{children}</WagmiProvider>;
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
