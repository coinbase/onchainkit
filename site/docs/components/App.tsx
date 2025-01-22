'use client';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import '@coinbase/onchainkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { useTheme } from '../contexts/Theme.tsx';

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'OnchainKit',
    }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

export default function App({ children }: { children: ReactNode }) {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    return null;
  }
  const viteCdpApiKey =
    import.meta.env.VITE_CDP_API_KEY || 'VmvIBxCiyNgDQ78njUIAql86kEokLMQ1';
  const viteProjectId =
    import.meta.env.VITE_CDP_PROJECT_ID ||
    '6eceb045-266a-4940-9d22-35952496ff00';
  const { theme } = useTheme();

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
