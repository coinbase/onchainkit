'use client';
import { useEffect } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
// import { OnchainKitProvider } from '../../../src';
import {
  RainbowKitProvider,
  connectorsForWallets,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  rainbowWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import type { ReactNode } from 'react';

import '@coinbase/onchainkit/styles.css';
// import '../../../src/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

export default function AppWithRK({ children }: { children: ReactNode }) {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    return null;
  }
  let wagmiConfig = null;
  useEffect(() => {
    const viteWalletConnectProjectId =
      import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'AddPourProjectIdHere';
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
        projectId: viteWalletConnectProjectId,
      },
    );
    wagmiConfig = getDefaultConfig({
      appName: 'onchainkit',
      connectors,
      projectId: viteWalletConnectProjectId,
      chains: [base],
      ssr: true, // If your dApp uses server side rendering (SSR)
    });
  }, [wagmiConfig]);
  if (!wagmiConfig) {
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
