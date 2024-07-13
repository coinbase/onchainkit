'use client';
import type { ReactNode } from 'react';
// import { OnchainKitProvider } from '@coinbase/onchainkit';
import { OnchainKitProvider } from '../../../src';
import { ConnectButton, RainbowKitProvider, connectorsForWallets, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, rainbowWallet, coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, http } from 'wagmi';
import { base } from 'wagmi/chains';

// import '@coinbase/onchainkit/styles.css';
import '../../../src/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

const VITE_WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'Add_Wallet_Connect_Project_Id';

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

const wagmiConfig = getDefaultConfig({
  appName: 'onchainkit',
  projectId: VITE_WALLET_CONNECT_PROJECT_ID,
  chains: [base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

// const wagmiConfig = getDefaultConfig({
//   chains: [base],
//   connectors,
//   ssr: true,
//   transports: {
//     [base.id]: http(),
//   },
// });

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
          <RainbowKitProvider>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ConnectButton />
            {children}
          </div>
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
