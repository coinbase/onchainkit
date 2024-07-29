"use client";

import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet } from "wagmi/connectors";
import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { WagmiProvider } from 'wagmi'; 

export const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  connectors: [
    coinbaseWallet({
      appName: "OnchainKit",
      preference: "smartWalletOnly",
    }),
    coinbaseWallet({
      appName: "OnchainKit",
      preference: "eoaOnly",
    }),
  ],
})

const queryClient = new QueryClient(); 
 
function OnchainProviders({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_OCK_API_KEY}
          chain={base}
          schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider> 
  );
}
 
export default OnchainProviders;