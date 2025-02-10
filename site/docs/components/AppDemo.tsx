'use client';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import '@coinbase/onchainkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { createWalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import type { Config } from 'wagmi';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { useTheme } from '../contexts/Theme.tsx';
import { useMemo } from 'react';

// WARNING: This is a publicly exposed private key used only for documentation demos.
// Do not use this key for any real transactions or store any assets in this account.
const DUMMY_PK =
  '0xa67bdd8a49324aa36cb3f7f7064b9b560e3aa653b774be9793415c0a6fc62cf8' as const;

const queryClient = new QueryClient();
const account = privateKeyToAccount(DUMMY_PK);
const demoClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});

const demoWalletConnector = (_config: Config) => {
  return {
    id: 'testWallet',
    name: 'Test Wallet',
    type: 'injected' as const,
    async connect() {
      return {
        accounts: [account.address],
        chainId: baseSepolia.id,
      };
    },
    async switchChain({ chainId }: { chainId: number }) {
      if (chainId === baseSepolia.id) {
        return baseSepolia;
      }
      if (chainId === base.id) {
        return base;
      }
      throw new Error('Unsupported chain');
    },
    async disconnect() {},
    async getAccount() {
      return account.address;
    },
    async getChainId() {
      return baseSepolia.id;
    },
    async isAuthorized() {
      return true;
    },
    onAccountsChanged() {},
    onChainChanged() {},
    onDisconnect() {},
    async getAccounts() {
      return [account.address];
    },
    async getProvider() {
      return demoClient;
    },
  };
};

const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    demoWalletConnector,
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

export default function AppDemo({ children }: { children: ReactNode }) {
  const isServer = typeof window === 'undefined';
  if (isServer) return null;
  
  const { theme } = useTheme();
  
  // Memoize the OnchainKit config
  const onchainConfig = useMemo(() => ({
    appearance: {
      mode: 'auto',
      theme,
    },
    autoConnect: true,
    chains: [base, baseSepolia],
  }), [theme]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={import.meta.env.VITE_CDP_API_KEY}
          chain={base}
          projectId={import.meta.env.VITE_CDP_PROJECT_ID} 
          schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
          config={onchainConfig}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
