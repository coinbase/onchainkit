import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'viem/chains';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { WalletDropdownDisconnect } from './WalletDropdownDisconnect';

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

export default {
  title: 'Wallet/WalletDropdownDisconnect',
  component: WalletDropdownDisconnect,
  decorators: [
    (Story) => (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={new QueryClient()}>
          <Story />
        </QueryClientProvider>
      </WagmiProvider>
    ),
  ],
};

export const Default = () => <WalletDropdownDisconnect />;

export const CustomText = () => <WalletDropdownDisconnect text="Log Out" />;

export const CustomClass = () => (
  <WalletDropdownDisconnect className="bg-red-500" />
);
