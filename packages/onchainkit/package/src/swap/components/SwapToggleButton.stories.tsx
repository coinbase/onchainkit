import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'viem/chains';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { SwapProvider } from './SwapProvider';
import { SwapToggleButton } from './SwapToggleButton';

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const meta = {
  title: 'Swap/ToggleButton',
  decorators: [
    (Story) => (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={new QueryClient()}>
          <SwapProvider
            address="0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1"
            experimental={{ useAggregator: true }}
          >
            <Story />
          </SwapProvider>
        </QueryClientProvider>
      </WagmiProvider>
    ),
  ],
  component: SwapToggleButton,
  tags: ['autodocs'],
} satisfies Meta<typeof SwapToggleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
