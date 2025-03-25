'use client';
import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { http, createConfig } from 'wagmi';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
  connectors: [
    coinbaseWallet({
      appName: 'Coinbase',
      appLogoUrl: 'https://avatars.githubusercontent.com/u/1885080?s=200&v=4',
      preference: 'smartWalletOnly',
    }),
    coinbaseWallet({
      appName: 'Coinbase',
      appLogoUrl: 'https://avatars.githubusercontent.com/u/1885080?s=200&v=4',
      preference: 'eoaOnly',
    }),
  ],
});

const queryClient = new QueryClient();

function MintProviders({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={ENVIRONMENT_VARIABLES[ENVIRONMENT.API_KEY]}
          chain={base}
          config={{
            appearance: {
              mode: 'light',
              theme: 'default',
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

export default MintProviders;
