import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useMemo } from 'react';
import {
  http,
  WagmiProvider,
  WagmiProviderNotFoundError,
  cookieStorage,
  createConfig,
  createStorage,
  useConfig,
} from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { ONCHAIN_KIT_CONFIG, setOnchainKitConfig } from './OnchainKitConfig';
import { checkHashLength } from './internal/utils/checkHashLength';
import type { OnchainKitContextType, OnchainKitProviderReact } from './types';

export const OnchainKitContext =
  createContext<OnchainKitContextType>(ONCHAIN_KIT_CONFIG);

/**
 * Provides the OnchainKit React Context to the app.
 */
export function OnchainKitProvider({
  address,
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

  let providedConfig = null;
  try {
    providedConfig = useConfig();
  } catch (error) {
    if (!(error instanceof WagmiProviderNotFoundError)) {
      console.error('Error fetching config, using OnchainKit defaults:', error);
      throw error;
    }
  }

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
        appearance: {
          mode: config?.appearance?.mode ?? 'auto',
          theme: config?.appearance?.theme ?? 'default',
        },
        paymaster: config?.paymaster || defaultPaymasterUrl,
      },
      projectId: projectId ?? null,
      rpcUrl: rpcUrl ?? null,
      schemaId: schemaId ?? null,
    };
    setOnchainKitConfig(onchainKitConfig);
    return onchainKitConfig;
  }, [address, apiKey, chain, config, projectId, rpcUrl, schemaId]);

  if (!providedConfig) {
    const wagmiConfig = createConfig({
      chains: [base],
      connectors: [
        coinbaseWallet({
          appName: config?.appearance?.name || 'My OnchainKit App',
          appLogoUrl:
            config?.appearance?.logo ||
            'https://avatars.githubusercontent.com/u/108554348?v=4',
          preference: 'smartWalletOnly',
        }),
      ],
      storage: createStorage({
        storage: cookieStorage,
      }),
      ssr: true,
      transports: {
        [base.id]: http(),
      },
    });

    return (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={new QueryClient()}>
          <OnchainKitContext.Provider value={value}>
            {children}
          </OnchainKitContext.Provider>
        </QueryClientProvider>
      </WagmiProvider>
    );
  }

  return (
    <OnchainKitContext.Provider value={value}>
      {children}
    </OnchainKitContext.Provider>
  );
}
