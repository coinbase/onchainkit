import type { Meta, StoryObj } from '@storybook/react';
import { SwapToggleButton } from './SwapToggleButton';
import { SwapProvider } from './SwapProvider';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const meta = {
  title: 'Swap/ToggleButton',
  component: () => (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={new QueryClient()}>
        <SwapProvider address="0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1">
          <SwapToggleButton />
        </SwapProvider>
      </QueryClientProvider>
    </WagmiProvider>
  ),
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SwapToggleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
