'use client';
import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import { http, createConfig } from 'wagmi';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

type Theme = 'light' | 'dark' | 'cyberpunk' | 'base' | 'minimal';

type ProviderState = {
  componentTheme?: Theme;
  setComponentTheme?: (theme: Theme) => void;
};

const defaultProviderState: ProviderState = {
  componentTheme: 'light',
};

export const ProviderContext =
  createContext<ProviderState>(defaultProviderState);

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
  const [componentTheme, setComponentThemeState] = useState<Theme>('light');

  useEffect(() => {
    const storedComponentTheme = localStorage.getItem('componentTheme');
    if (storedComponentTheme) {
      setComponentThemeState(storedComponentTheme as Theme);
    }
  }, []);

  useEffect(() => {
    if (componentTheme) {
      console.log('Current theme:', componentTheme);
    }
  }, [componentTheme]);

  const setComponentTheme = (newComponentTheme: Theme) => {
    localStorage.setItem('componentTheme', newComponentTheme);
    setComponentThemeState(newComponentTheme);
  };

  return (
    <ProviderContext.Provider
      value={{
        componentTheme,
        setComponentTheme,
      }}
    >
      <WagmiProvider config={config} reconnectOnMount={false}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            apiKey={ENVIRONMENT_VARIABLES[ENVIRONMENT.API_KEY]}
            chain={base}
            config={{
              theme: componentTheme || 'light', // 'light - default', 'dark - midnight', 'base', 'cyberpunk', minimal
            }}
            projectId={ENVIRONMENT_VARIABLES[ENVIRONMENT.PROJECT_ID]}
            schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
          >
            {children}
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ProviderContext.Provider>
  );
}

export default OnchainProviders;
