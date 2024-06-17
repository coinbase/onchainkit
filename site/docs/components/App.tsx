'use client';
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
// import { OnchainKitProvider } from '../../../src';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

import '@coinbase/onchainkit/styles.css';
// import '../../../src/styles.css';

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appChainIds: [base.id],
      appName: 'onchainkit',
      options: {
        chainId: base.id,
      },
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
  const VITE_CDP_API_KEY = import.meta.env.VITE_CDP_API_KEY;
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider apiKey={VITE_CDP_API_KEY} chain={base}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
