import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      chainId: baseSepolia.id,
      appName: 'onchainkit',
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});

export function ComponentPreview(props: React.PropsWithChildren): JSX.Element | null {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    return null;
  }
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <main className="flex h-72 items-center justify-center">{props.children}</main>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
