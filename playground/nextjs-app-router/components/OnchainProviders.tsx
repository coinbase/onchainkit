'use client';
import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
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
    <OnchainKitProvider
      apiKey={ENVIRONMENT_VARIABLES[ENVIRONMENT.API_KEY]}
      chain={base}
      config={{
        appearance: {
          name: 'test dapp name',
          mode: 'auto',
          theme: 'default',
        },
      }}
      projectId={ENVIRONMENT_VARIABLES[ENVIRONMENT.PROJECT_ID]}
      schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
    >
      {children}
    </OnchainKitProvider>
  );
}

export default OnchainProviders;
