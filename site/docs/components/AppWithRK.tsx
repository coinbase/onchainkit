'use client';
import { OnchainKitProvider } from '@coinbase/onchainkit';
// import { OnchainKitProvider } from '../../../src';
import {
  RainbowKitProvider,
  connectorsForWallets,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';

import '@coinbase/onchainkit/styles.css';
// import '../../../src/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

const VITE_WALLET_CONNECT_PROJECT_ID =
  import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'AddPourProjectIdHere';

const queryClient = new QueryClient();

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended Wallet',
      wallets: [coinbaseWallet],
    },
    {
      groupName: 'Other Wallets',
      wallets: [rainbowWallet, metaMaskWallet],
    },
  ],
  {
    appName: 'onchainkit',
    projectId: VITE_WALLET_CONNECT_PROJECT_ID,
  },
);

const wagmiConfig =
  typeof window === 'undefined'
    ? {}
    : getDefaultConfig({
        appName: 'onchainkit',
        connectors,
        projectId: VITE_WALLET_CONNECT_PROJECT_ID,
        chains: [base],
        ssr: true, // If your dApp uses server side rendering (SSR)
      });

export default function AppWithRK({ children }: { children: ReactNode }) {
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
          <RainbowKitProvider modalSize="compact">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {children}
            </div>
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
