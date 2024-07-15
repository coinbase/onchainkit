'use client';
import { OnchainKitProvider } from '@coinbase/onchainkit';
// import { OnchainKitProvider } from '../../../src';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import type { ReactNode } from 'react';

import '@coinbase/onchainkit/styles.css';
// import '../../../src/styles.css';

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: 'onchainkit',
    }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});

export default function App({ children }: { children: ReactNode }) {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    return null;
  }
  const viteCdpApiKey = import.meta.env.VITE_CDP_API_KEY;
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={viteCdpApiKey}
          chain={base}
          schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
