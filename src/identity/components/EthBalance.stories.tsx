import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'viem/chains';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { EthBalance } from './EthBalance';

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const meta = {
  title: 'Identity/EthBalance',
  component: EthBalance,
  decorators: [
    (Story) => {
      return (
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={new QueryClient()}>
            <Story />
          </QueryClientProvider>
        </WagmiProvider>
      );
    },
  ],
  tags: ['autodocs'],
  args: {
    address: '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1',
  },
} satisfies Meta<typeof EthBalance>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
