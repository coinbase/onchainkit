'use client';
import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { defineChain } from 'viem';
import { http, createConfig } from 'wagmi';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const LRDS_CHAIN = defineChain({
  id: 84530008,
  name: 'Blocklords',
  nativeCurrency: {
    name: 'Blocklords',
    symbol: 'LRDS',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://lordchain-rpc.appchain.base.org'],
    },
  },
});

export const config = createConfig({
  chains: [base, baseSepolia, LRDS_CHAIN],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [LRDS_CHAIN.id]: http(),
  },
  ssr: true,
  connectors: [
    coinbaseWallet({
      appName: 'OnchainKit',
      preference: 'smartWalletOnly',
    }),
    coinbaseWallet({
      appName: 'OnchainKit',
      preference: 'eoaOnly',
    }),
  ],
});

const queryClient = new QueryClient();

function OnchainProviders({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={ENVIRONMENT_VARIABLES[ENVIRONMENT.API_KEY]}
          chain={base}
          config={{
            appearance: {
              name: 'OnchainKit Playground',
              logo: 'https://pbs.twimg.com/media/GkXUnEnaoAIkKvG?format=jpg&name=medium',
              mode: 'auto',
              theme: 'default',
            },
            wallet: {
              display: 'modal', // 'modal' || 'classic"
              termsUrl: 'https://www.coinbase.com/legal/cookie',
              privacyUrl: 'https://www.coinbase.com/legal/privacy',
              supportedWallets: {
                rabby: false,
                trust: false,
                frame: false,
              },
            },
          }}
          projectId={ENVIRONMENT_VARIABLES[ENVIRONMENT.PROJECT_ID]}
          schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default OnchainProviders;
