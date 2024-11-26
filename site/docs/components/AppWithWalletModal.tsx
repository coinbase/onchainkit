'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import '@coinbase/onchainkit/styles.css';
import { useTheme } from '../contexts/Theme.tsx';

export const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'OnchainKit',
      preference: 'all',
    }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

export default function AppWithWalletModal({
  children,
}: {
  children: ReactNode;
}) {
  const { theme } = useTheme();

  const isServer = typeof window === 'undefined';
  if (isServer) {
    return null;
  }
  const viteCdpApiKey = import.meta.env.VITE_CDP_API_KEY;
  const viteProjectId = import.meta.env.VITE_CDP_PROJECT_ID;

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={viteCdpApiKey}
          chain={base} // TODO: remove
          projectId={viteProjectId}
          schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
          config={{
            appearance: {
              mode: 'auto',
              theme: theme,
            },
            wallet: {
              display: 'modal', // 'modal' | 'classic'
              termsUrl: 'https://www.coinbase.com/legal/privacy',
              privacyUrl: 'https://www.coinbase.com/legal/cookie',
            },
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
